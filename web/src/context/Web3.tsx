import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Outlet } from "react-router-dom";

interface Web3Context {
    provider: ethers.BrowserProvider,
    signer: ethers.JsonRpcSigner,
    userAddress: string | null,
    setAddress: (address: string) => void
}

export const Web3Context = createContext<Web3Context>(undefined!);

function Web3Provider() {
    const [address, setAddress] = useState('');
    const [correctChain, setCorrectChain] = useState(
        window.ethereum?.chainId === import.meta.env.VITE_CHAIN_ID
    );
    const [provider, setProvider] = useState<ethers.BrowserProvider>();
    const [signer, setSigner] = useState<ethers.JsonRpcSigner>();

    async function addChain() {
        await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: import.meta.env.VITE_CHAIN_ID,
                    chainName: 'LocalHost',
                    rpcUrls: ['http://127.0.0.1:8545/'],
                },
            ],
        });
    }

    async function waitCorrectNetwork() {
        if (correctChain) return;

        await window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: import.meta.env.VITE_CHAIN_ID }],
        }).catch((error) => {
            if (error.code !== 4902) {
                console.error('switchEthereumChain: ' + error);
                return;
            }
            return addChain().catch((error) => console.error('addChain: ' + error));
        });
        setCorrectChain(window.ethereum?.chainId === import.meta.env.VITE_CHAIN_ID);
    }

    async function onConnectionEstablished() {
        const addresses = await window.ethereum!.request<string[]>({ method: 'eth_accounts' });
        if (addresses && addresses[0]) {
            setAddress(addresses[0]);
        }

        window.ethereum?.on('accountsChanged', () => window.location.reload());
        window.ethereum?.on('chainChanged', () => window.location.reload());

        await waitCorrectNetwork();

        const provider = new ethers.BrowserProvider(window.ethereum!);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
    }

    useEffect(() => {
        if (window.ethereum?.isConnected()) {
            onConnectionEstablished();
            return;
        }

        window.ethereum?.on('connect', () => {
            onConnectionEstablished();
        });
    }, []);

    if (!provider || !signer) {
        return <></>
    }

    if (!correctChain) {
        return (
            <>
                Please change network
            </>
        )
    }

    return (
        <Web3Context.Provider value = {{ provider, signer, userAddress: address, setAddress }}>
            <Outlet/>
        </Web3Context.Provider>
    );
}

export default Web3Provider;
