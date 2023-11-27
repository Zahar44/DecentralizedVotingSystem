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
    authFetch?: (api: string, init?: RequestInit, retryCount?: number) => Promise<Response>;
    fetch?: (api: string, init?: RequestInit, retryCount?: number) => Promise<Response>;
}

export const ProtocolContext = createContext<ProtocolContext>({});

export function ProtocolProvider() {
    const { signer, userAddress } = useContext(Web3Context);
    const [ votingToken, setVotingToken ] = useState<VotingTokenHandler>();
    const [ votingSystem, setVotingSystem ] = useState<VotingSystemHandler>();
    const [ permissions, setPermissions ] = useState<ProtocolPermissions>();

    const baseFetch = async (api: string, init?: RequestInit, retryCount?: number, auth?: (init: RequestInit) => Promise<void>) => {
        if (!init) init = {};
        if (!init.headers) init.headers = {};
        if (!retryCount) retryCount = 1;
        setCorsHeaders(init.headers);

        await auth?.(init);

        let resp: Response = await fetch(import.meta.env.VITE_API_URL + api, init);
        while (--retryCount > 0) {
            if (resp.ok) return resp;
            await new Promise((resolve) => setTimeout(resolve, 500));
            resp = await fetch(import.meta.env.VITE_API_URL + api, init);
        }
        return resp;
    }

    const context: ProtocolContext = {
        votingToken,
        votingSystem,
        protocolHandler: new ProtocolHandler(
            '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            signer,
        ),
        permissions,
        authFetch: async (api, init, retryCount) => {
            return baseFetch(api, init, retryCount, async (_init) => {
                const token = await getValidAccessToken(userAddress!, signer);
                _init.headers = {
                    ..._init.headers,
                    'Authorization': `Bearer ${token}`,
                }
            });
        },
        fetch: async (api, init, retryCount) => baseFetch(api, init, retryCount),
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
