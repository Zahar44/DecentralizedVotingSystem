import { encodeEventSignature } from 'web3-eth-abi';
import { ERC20Events, VotingSystemEvents } from './abi';

export const Topics = {
    Transfer: encodeEventSignature(ERC20Events.transfer),
    VotingCreated: encodeEventSignature(VotingSystemEvents.votingCreated),
    Voted: encodeEventSignature(VotingSystemEvents.voted),
} as const; 
