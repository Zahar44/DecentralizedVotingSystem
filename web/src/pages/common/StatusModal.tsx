import './StatusModal.css';
import ReactModal from "react-modal";

export interface StatusModalProps {
    isOpen: boolean;
    isSuccess: boolean;
}

function StatusModal({ isOpen, isSuccess }: StatusModalProps) {
    let content = isSuccess ?
        <>
            <img src='/success.png' alt='success' width={250} height={250}/>
            Operation seceded.
        </> :
        <div>
            <img src='/fail.png' alt='fail' width={250} height={250}/>
            Operation failed.
        </div>

    return <>
        <ReactModal className='status-modal' isOpen={isOpen}>
            <div className='status-content'>
                {content}
            </div>
        </ReactModal>
    </>;
}

export default StatusModal;