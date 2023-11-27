export const VotingSystemEvents = {
    votingCreated: {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "treasury",
                        "type": "address"
                    }
                ],
                "indexed": false,
                "internalType": "struct IVotingSystem.CreateVotingProps",
                "name": "props",
                "type": "tuple"
            }
        ],
        "name": "VotingCreated",
        "type": "event"
    },
    voted: {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Voted",
        "type": "event"
    }
};