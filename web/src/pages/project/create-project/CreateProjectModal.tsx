import { FormEvent, useContext, useState } from 'react';
import './CreateProjectModal.css'
import ReactModal from "react-modal";
import { useNavigate } from 'react-router-dom';
import SendTransactionModal from '../../common/SendTransactionModal';
import { ProtocolContext } from '../../../context/Protocol';
import CreateProjectModalInputs, { CreateProjectModalInputsState } from './CreateProjectModalInputs';
import { CreateMetadataDto } from '@server/metadata/dto';

ReactModal.setAppElement('#root');

interface CreateProjectModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

function CreateProjectModal({ isOpen, onRequestClose }: CreateProjectModalProps) {
    const protocol = useContext(ProtocolContext);
    const queryParams = new URLSearchParams(location.search);
    const [inputs, setInputs] = useState<CreateProjectModalInputsState>({
        name: queryParams.get('name') || '',
        description: queryParams.get('description') || '',
        image: '',
    });
    const setInputsAndUpdateUrl = (state: CreateProjectModalInputsState) => {
        state.name ? queryParams.set('name', state.name) : queryParams.delete('name');
        state.description ? queryParams.set('description', state.description) : queryParams.delete('description');

        const queryStr = queryParams.size > 0 ? `?${queryParams.toString()}` : location.pathname;
        history.pushState({}, '', queryStr);
        setInputs(state);
    }

    const [sendTransaction, setSendTransaction] = useState(false);
    const navigate = useNavigate();

    const createTransaction = async () => {
        return protocol.votingSystem!.createProject();
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!protocol.votingSystem) return;
        const tokenId = await protocol.votingSystem.getTotalSupply();
        const resp = await protocol.votingSystem.createProject();

        resp?.onConfirmed(() => {
            const body: CreateMetadataDto = {
                name: inputs.name,
                description: inputs.description,
                tokenId,
                image: inputs.image,
            };
            protocol.authFetch?.(
                'metadata',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                },
                3,
            ).then(() => {
                window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                      type: 'ERC721', // or 'ERC1155'
                      options: {
                        address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0', // The address of the token.
                        tokenId: tokenId.toString(), // ERC-721 or ERC-1155 token ID.
                      },
                    },
                  });
            });
        });
    }

    return (
        <ReactModal className='create-project-modal' isOpen={isOpen} onRequestClose={onRequestClose}>
            <SendTransactionModal onConfirmed={() => navigate('project')} transaction={createTransaction} open={sendTransaction}/>
            <div className='create-project-modal-content'>
                <form onSubmit={handleSubmit}>
                    <CreateProjectModalInputs state={inputs} setState={setInputsAndUpdateUrl}/>
                    <div>
                        <input type='submit'/>
                    </div>
                </form>
            </div>
        </ReactModal>
    )
}

export default CreateProjectModal;
