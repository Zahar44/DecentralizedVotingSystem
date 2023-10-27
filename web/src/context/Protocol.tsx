import { Contract } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { ERC20TokenABI } from "../abi/Tokens";
import { ProtocolHandler, ProtocolPermissions } from "../utils/ProtocolHandler";
import { Web3Context } from "./Web3";
import { Outlet } from "react-router-dom";

interface ProtocolContext {
    votingToken: Contract | null;
    protocolHandler: ProtocolHandler | null;
    permissions: ProtocolPermissions | null;
}

const defaultContextValue: ProtocolContext = {
    votingToken: null,
    protocolHandler: null,
    permissions: null,
}

export const ProtocolContext = createContext<ProtocolContext>(defaultContextValue);

export function ProtocolProvider() {
    const { signer, userAddress } = useContext(Web3Context);
    const [ votingToken, setVotingToken ] = useState<Contract | null>(null);
    const [ permissions, setPermissions ] = useState<ProtocolPermissions | null>(null);

    const context: ProtocolContext = {
        votingToken,
        protocolHandler: new ProtocolHandler(
            '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            signer,
        ),
        permissions,
    };

    useEffect(() => {
        context.protocolHandler?.getContractAddress(0).then((address) => {
            console.log(address);
            setVotingToken(new Contract(address, Object.values(ERC20TokenABI), signer));
        });
    }, []);

    useEffect(() => {
        context.protocolHandler?.getPermissions(userAddress!).then(setPermissions);
    }, []);

    return (
        <ProtocolContext.Provider value={context}>
            <Outlet/>
        </ProtocolContext.Provider>
    );
}

export default ProtocolProvider;
