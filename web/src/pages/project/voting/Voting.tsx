import { useContext } from "react";
import { ProtocolContext } from "../../../context/Protocol";
import { useNavigate } from "react-router-dom";
import VotingList from "./VotingList";

function Voting() {
    const { permissions } = useContext(ProtocolContext);
    const navigate = useNavigate();

    const adminButton = permissions?.isAnythingAllowed() ?
        (<button onClick={() => navigate('/admin')}> To Admin Panel </button>) :
        (<></>);

    return (
        <div>
            Voting
            <button onClick={() => navigate('new')}>Create Project</button>
            { adminButton }
            { <VotingList/> }
        </div>
    )
}

export default Voting;
