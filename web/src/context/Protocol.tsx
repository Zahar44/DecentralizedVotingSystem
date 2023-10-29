import { createContext, useContext, useEffect, useState } from "react";
import { ProtocolHandler, ProtocolPermissions } from "../utils/ProtocolHandler";
import { Web3Context } from "./Web3";
import { Outlet } from "react-router-dom";
import { VotingTokenHandler } from "../utils/VotingTokenHandler";

interface ProtocolContext {
    votingToken: VotingTokenHandler | null;
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
    const [ votingToken, setVotingToken ] = useState<VotingTokenHandler | null>(null);
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
            setVotingToken(new VotingTokenHandler(address, signer));
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
