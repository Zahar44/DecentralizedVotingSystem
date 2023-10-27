import { createContext, useEffect, useState, useContext } from "react";
import { ProtocolContext } from "../../context/Protocol";
import { Web3Context } from "../../context/Web3";
import { ethers } from "ethers";

interface VotingPowerContext {
    power: string;
}

const defaultContextValue: VotingPowerContext = {
    power: '0',
}

export const VotingPowerContext = createContext<VotingPowerContext>(defaultContextValue);

export function VotingPowerProvider({ children }: React.PropsWithChildren) {
    const { userAddress } = useContext(Web3Context);
    const { votingToken } = useContext(ProtocolContext);
    let [power, setPower] = useState('0');

    useEffect(() => {
        votingToken?.balanceOf(userAddress).then((power) => {
            setPower((+ethers.formatEther(power)).toFixed(2));
        });
    }, [votingToken]);

    return (
        <VotingPowerContext.Provider value={{ power }}>
            { children }
        </VotingPowerContext.Provider>
    );
}

export default VotingPowerProvider;
