//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface IProtocol {
    enum ContractTypes {
        VotingToken
    }

    struct TypeAndAddress {
        ContractTypes contractType;
        address contractAddress;
    }

    function getContractAddress(ContractTypes _type) external view returns(address);
    function getPermissions(address user) external view returns(uint32);
}
