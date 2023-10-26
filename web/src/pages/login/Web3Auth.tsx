import { Maybe } from "@metamask/providers/dist/utils";
import { useSDK } from "@metamask/sdk-react";
import { ethers, Contract } from "ethers";
import { ProtocolABI } from "../../abi/Protocol";
import { useEffect, useState } from "react";

export function useAccount() {
    const [userAddress, setUserAddress] = useState('');

    const { sdk, provider } = useSDK();
    useEffect(() => {
		const switchToNetwork = async () => {
				try {
					await provider?.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x7A69' }],
					});
				} catch (switchError) {
					// This error code indicates that the chain has not been added to MetaMask.
					if (
						typeof switchError === "object" &&
						"code" in switchError! &&
						switchError.code === 4902) {
					try {
					await provider?.request({
						method: 'wallet_addEthereumChain',
						params: [
						{
							chainId: '0x7A69',
							chainName: 'Local',
							rpcUrls: ['http://127.0.0.1:8545/'] /* ... */,
						},
						],
					});
					} catch (addError) {
					// handle "add" error
					}
				}
				// handle other "switch" errors
			}
      }

      const connect = async () => {
        try {
            const accounts = (await sdk?.connect()) as Maybe<string[]>;
            console.log(accounts);
            return accounts?.at(0);
            const ethersProvider = new ethers.BrowserProvider(provider!);
            const contract = new Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", [ProtocolABI.getContractAddress], ethersProvider);
            const res = await contract.getContractAddress(0);
            console.log(res);
        } catch(error) {
            console.error(`Can't connect: ${error}`);
        }
      };

      connect().then((account) => {
        setUserAddress(account || '');
        console.log(account);
        switchToNetwork();
      });
    }, []);

  	if (userAddress) return userAddress;
}
