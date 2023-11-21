import { useContext, useState } from 'react';
import './MintModal.css'
import ReactModal from "react-modal";
import { ethers } from 'ethers';
import { ProtocolContext } from '../../../context/Protocol';
import { Web3Context } from '../../../context/Web3';

ReactModal.setAppElement('#root');

interface MintModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

function MintModal({ isOpen, onRequestClose }: MintModalProps) {
    const { userAddress } = useContext(Web3Context);
    const { votingToken } = useContext(ProtocolContext);
    const [mintValue, setMintValue] = useState(0);

    const onMintValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        if (!Number.isNaN(value))
            setMintValue(value);
    }

    const handleMint = async () => {
        try {
            const resp = await votingToken?.mint(userAddress!, ethers.parseEther(mintValue.toString()));
            await resp?.waitConfirm();
            onRequestClose();
        } catch(error) {
            console.error('handleMint: ' + error);
            onRequestClose();
        }
    }

    return (
        <ReactModal className='mint-modal' isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className='mint-modal-content'>
                <div>
                    Enter amount in ether to mint
                </div>
                <div>
                    <input value={mintValue} onChange={onMintValueChange}/>
                </div>
                <div>
                    <button onClick={handleMint}>
                        Mint
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}

export default MintModal;
