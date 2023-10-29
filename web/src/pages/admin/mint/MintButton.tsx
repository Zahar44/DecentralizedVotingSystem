import MintModal from './MintModal';
import { useState } from 'react';

function MintButton() {
    const [openModal, setOpenModal] = useState(false);

    const handleClick = () => {
        setOpenModal(true);
    };

    const onClose = () => {
        setOpenModal(false);
    };

    return (
        <>
            <button onClick={handleClick}>
                Mint
            </button>
            <MintModal isOpen={openModal} onRequestClose={onClose}/>
        </>
    )
}

export default MintButton;