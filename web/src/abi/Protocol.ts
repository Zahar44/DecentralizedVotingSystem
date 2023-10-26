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
} as const;
