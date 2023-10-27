import { useContext } from "react";
import { ProtocolContext } from "../../../context/Protocol";
import { useNavigate } from "react-router-dom";

function Voting() {
    const { permissions } = useContext(ProtocolContext);
    const navigate = useNavigate();

    const adminButton = permissions?.isAnythingAllowed() ?
        (<button onClick={() => navigate('/admin')}> To Admin Panel </button>) :
        (<></>);

    return (
        <div>
            Voting
            { adminButton }
        </div>
    )
}

export default Voting;
