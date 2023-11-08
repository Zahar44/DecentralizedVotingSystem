import './SendTransactionModal.css'
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { ContractResponseHandler } from "../../utils/ContractResponseHandler";

export interface SendTransactionModalProps {
    open: boolean;
    onConfirmed: () => void;
    transaction: () => Promise<ContractResponseHandler>;
}

type AnimationState = 'none' | 'success' | 'failed'; 

function SendTransactionModal({ onConfirmed, transaction, open }: SendTransactionModalProps) {
    const [animation, setAnimation] = useState<AnimationState>('none');

    useEffect(() => {
        if (!open) return;
        let timeout: NodeJS.Timeout;
        
        transaction().then((handler) => {
            handler.onConfirmed((status) => {
                setMetadata().then(() => {
                    setAnimation(status);
                    setTimeout(() => {
                        onConfirmed();
                    }, 2000);
                });
            });
        });

        return () => {
            clearTimeout(timeout);
        };
    }, [open]);

    const setMetadata = async () => {
        await fetch(import.meta.env.VITE_API_URL + 'metadata', { method: 'POST' });
    }

    const animationImage = animation === 'success' ? <img src='/success.png'/> : <></>;
    
    return (
        <ReactModal className='send-transaction-modal' isOpen={open}>
            {animationImage}
        </ReactModal>
    )
}

export default SendTransactionModal;
