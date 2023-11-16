export const VotingSystemABI = {
    createVoting: {
        "inputs": [],
        "name": "createVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    totalSupply: {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
} as const;