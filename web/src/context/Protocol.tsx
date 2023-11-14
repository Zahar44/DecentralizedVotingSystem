import { createContext, useContext, useEffect, useState } from "react";
import { ProtocolHandler, ProtocolPermissions } from "../utils/ProtocolHandler";
import { Web3Context } from "./Web3";
import { Outlet } from "react-router-dom";
import { VotingTokenHandler } from "../utils/VotingTokenHandler";
import { VotingSystemHandler } from "../utils/VotingSystemHandler";
import { getValidAccessToken, setCorsHeaders } from "../utils/AuthFetch";

interface ProtocolContext {
    votingToken?: VotingTokenHandler;
    votingSystem?: VotingSystemHandler;
    protocolHandler?: ProtocolHandler;
    permissions?: ProtocolPermissions;
    authFetch?: (api: string, init?: RequestInit) => Promise<Response>;
}

export const ProtocolContext = createContext<ProtocolContext>({});

export function ProtocolProvider() {
    const { signer, userAddress } = useContext(Web3Context);
    const [ votingToken, setVotingToken ] = useState<VotingTokenHandler>();
    const [ votingSystem, setVotingSystem ] = useState<VotingSystemHandler>();
    const [ permissions, setPermissions ] = useState<ProtocolPermissions>();

    const context: ProtocolContext = {
        votingToken,
        votingSystem,
        protocolHandler: new ProtocolHandler(
            '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            signer,
        ),
        permissions,
        authFetch: async (api, init) => {
            if (!init) init = {};
            if (!init.headers) init.headers = {};
            setCorsHeaders(init.headers);
            const token = await getValidAccessToken(userAddress!, signer);
            init.headers = {
                ...init.headers,
                'Authorization': `Bearer ${token}`,
            }

            return fetch(import.meta.env.VITE_API_URL + api, init);
        }
    };

    useEffect(() => {
        context.protocolHandler?.getContractAddress().then((addresses) => {
            setVotingToken(new VotingTokenHandler(addresses[0], signer));
            setVotingSystem(new VotingSystemHandler(addresses[1], signer));
        });
        context.protocolHandler?.getPermissions(userAddress!).then(setPermissions);
    }, []);

    return (
        <ProtocolContext.Provider value={context}>
            <Outlet/>
        </ProtocolContext.Provider>
    );
}

export default ProtocolProvider;
