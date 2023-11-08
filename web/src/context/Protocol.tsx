import { createContext, useContext, useEffect, useState } from "react";
import { ProtocolHandler, ProtocolPermissions } from "../utils/ProtocolHandler";
import { Web3Context } from "./Web3";
import { Outlet } from "react-router-dom";
import { VotingTokenHandler } from "../utils/VotingTokenHandler";
import { VotingSystemHandler } from "../utils/VotingSystemHandler";

interface ProtocolContext {
    votingToken: VotingTokenHandler | null;
    votingSystem: VotingSystemHandler | null;
    protocolHandler: ProtocolHandler | null;
    permissions: ProtocolPermissions | null;
}

const defaultContextValue: ProtocolContext = {
    votingToken: null,
    votingSystem: null,
    protocolHandler: null,
    permissions: null,
}

export const ProtocolContext = createContext<ProtocolContext>(defaultContextValue);

export function ProtocolProvider() {
    const { signer, userAddress } = useContext(Web3Context);
    const [ votingToken, setVotingToken ] = useState<VotingTokenHandler | null>(null);
    const [ votingSystem, setVotingSystem ] = useState<VotingSystemHandler | null>(null);
    const [ permissions, setPermissions ] = useState<ProtocolPermissions | null>(null);

    const context: ProtocolContext = {
        votingToken,
        votingSystem,
        protocolHandler: new ProtocolHandler(
            '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            signer,
        ),
        permissions,
    };

    useEffect(() => {
        context.protocolHandler?.getContractAddress().then((addresses) => {
            setVotingToken(new VotingTokenHandler(addresses[0], signer));
            setVotingSystem(new VotingSystemHandler(addresses[1], signer));
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
