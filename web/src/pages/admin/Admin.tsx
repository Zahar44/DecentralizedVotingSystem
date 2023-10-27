import { useContext } from "react";
import { ProtocolContext } from "../../context/Protocol";
import { ProtocolAction } from "../../utils/ProtocolHandler";
import { Web3Context } from "../../context/Web3";
import { ethers } from "ethers";

function Admin() {
    const { userAddress } = useContext(Web3Context);
    const { permissions, votingToken } = useContext(ProtocolContext);

    let buttons: JSX.Element[] = [];

    if (permissions?.isActionAllowed(ProtocolAction.MintVotingPower)) {
        async function handleMint() {
            console.log(ethers.parseEther('1'));
            await votingToken?.mint(userAddress, ethers.parseEther('1'));
        }
        buttons.push((<button key="mint-button" onClick={handleMint}>Mint</button>));
    }
    
    if (permissions?.isActionAllowed(ProtocolAction.SetAddress)) {
        buttons.push((<button key="set-address-button">Set Address</button>));
    }
    
    if (permissions?.isActionAllowed(ProtocolAction.SetPermissions)) {
        buttons.push((<button key="set-permission-button">Set Permission</button>));
    }

    return (
        <>
            { buttons }
        </>
    )
}

export default Admin;