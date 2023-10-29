import './Admin.css';
import { useContext } from "react";
import { ProtocolContext } from "../../context/Protocol";
import { ProtocolAction } from "../../utils/ProtocolHandler";
import MintButton from "./mint/MintButton";
import { useNavigate } from 'react-router-dom';

function Admin() {
    const { permissions } = useContext(ProtocolContext);
    const navigate = useNavigate();

    let buttons: JSX.Element[] = [];

    if (permissions?.isActionAllowed(ProtocolAction.MintVotingPower)) {
        buttons.push((<MintButton key="mint-button"/>));
    }
    
    if (permissions?.isActionAllowed(ProtocolAction.SetAddress)) {
        buttons.push((<button key="set-address-button">Set Address</button>));
    }
    
    if (permissions?.isActionAllowed(ProtocolAction.SetPermissions)) {
        buttons.push((<button key="set-permission-button">Set Permission</button>));
    }

    const onBackClick = () => {
        navigate(-1);
    }
    buttons.push((<button key="back" onClick={onBackClick}>Back</button>));

    return (
        <div className='admin'>
            { buttons }
        </div>
    )
}

export default Admin;