import "./Header.css"
import { useContext } from "react";
import { VotingPowerContext } from "../../protocol/VotingPower";
import { Web3Context } from "../../../context/Web3";

function Header() {
    const { userAddress: address } = useContext(Web3Context);
    const context = useContext(VotingPowerContext);
    const addressStart = address!.substring(0, 3);
    const addressEnd = address!.substring(address!.length - 3);
    const addressFormated = addressStart + '...' + addressEnd;

    return (
        <div className='header'>
            <div>
                { addressFormated }
            </div>
            <div>
                Voting Power { context.power }
            </div>
        </div>
    )
}

export default Header;
