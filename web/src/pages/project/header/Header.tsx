import "./Header.css"
import { useContext } from "react";
import { VotingPowerContext } from "../../../context/VotingPower";
import { Web3Context } from "../../../context/Web3";

function Header() {
    const { userAddress } = useContext(Web3Context);
    const context = useContext(VotingPowerContext);
    const addressStart = userAddress!.substring(0, 3);
    const addressEnd = userAddress!.substring(userAddress!.length - 3);
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
