export const ProtocolABI = {
    getContractAddress: {
        "inputs": [
            {
                "internalType": "enum Protocol.ContractTypes",
                "name": "_type",
                "type": "uint8"
            }
        ],
        "name": "getContractAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    getPermissions: {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getPermissions",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
} as const;
