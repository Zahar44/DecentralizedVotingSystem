import { encodeEventSignature } from 'web3-eth-abi';
import { ERC20Events } from './abi';

export const Topics = {
    Transfer: encodeEventSignature(ERC20Events.transfer),
} as const; 
