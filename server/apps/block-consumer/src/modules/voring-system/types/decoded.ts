import { DecodedParams } from "web3";

export interface DecodedVotingCreated extends DecodedParams {
    issuer: string;
    projectId: bigint;
    props: {
        name: string;
        description: string;
        price: bigint;
        treasury: string;
    };
}