export interface CreateVotingProps {
    name: string;
    description: string;
    price: string;
    treasury: string;
}

export interface VoteProps {
    projectId: number;
    amount: string;
}