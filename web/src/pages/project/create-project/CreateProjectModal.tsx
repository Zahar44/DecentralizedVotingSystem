import { FormEvent, useContext, useState } from 'react';
import './CreateProjectModal.css'
import ReactModal from "react-modal";
import { ProtocolContext } from '../../../context/Protocol';
import CreateProjectModalInputs, { CreateProjectModalInputsState } from './CreateProjectModalInputs';
import StatusModal, { StatusModalProps } from '../../common/StatusModal';

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
    });
    const [statusModalProps, setStatusModalProps] = useState<StatusModalProps>({
        isOpen: false,
        isSuccess: false,
    });
    const setInputsAndUpdateUrl = (state: CreateProjectModalInputsState) => {
        state.name ? queryParams.set('name', state.name) : queryParams.delete('name');
        state.description ? queryParams.set('description', state.description) : queryParams.delete('description');

        const queryStr = queryParams.size > 0 ? `?${queryParams.toString()}` : location.pathname;
        history.pushState({}, '', queryStr);
        setInputs(state);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!protocol.votingSystem) return;
        const tokenId = await protocol.votingSystem.getTotalSupply();
        const resp = await protocol.votingSystem.createProject({
            name: inputs.name,
            description: inputs.description,
            treasury: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
            price: '123',
        });
        await resp?.waitConfirm();

        return;
        if (!inputs.image) return;
        
        const formData = new FormData();
        formData.append('name', inputs.name);
        formData.append('description', inputs.description);
        formData.append('tokenId', tokenId.toString());
        formData.append('image', inputs.image);
        const metadataResp = await protocol.authFetch?.(
            'metadata',
            {
                method: 'POST',
                body: formData,
            },
            3,
        );
        window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC721',
                options: {
                    address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
                    tokenId: tokenId.toString(),
                },
            },
        });

        setStatusModalProps({
            isOpen: true,
            isSuccess: metadataResp?.ok === true,
        });
        setTimeout(() => {
            onRequestClose();
        }, 2000);
    }

    return (
        <>
            <StatusModal isOpen={statusModalProps.isOpen} isSuccess={statusModalProps.isSuccess}/>
            <ReactModal className='create-project-modal' isOpen={!statusModalProps.isOpen && isOpen} onRequestClose={onRequestClose}>
                <div className='create-project-modal-content'>
                    <form onSubmit={handleSubmit}>
                        <CreateProjectModalInputs state={inputs} setState={setInputsAndUpdateUrl}/>
                        <div className='create-project-modal-box'>
                            <input type='submit' value='Submit'/>
                        </div>
                    </form>
                </div>
            </ReactModal>
        </>
    )
}

export default CreateProjectModal;
