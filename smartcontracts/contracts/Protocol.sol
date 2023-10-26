//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Protocol is Ownable {
    enum ContractTypes {
        VotingToken
    }

    struct TypeAndAddress {
        ContractTypes contractType;
        address contractAddress;
    }

    mapping(ContractTypes => address) addressByType; 

    constructor(TypeAndAddress[] memory data) Ownable(msg.sender) {
        setAddress(data);
    }

    function getContractAddress(ContractTypes _type) external view returns(address) {
        return addressByType[_type];
    }

    function setAddress(TypeAndAddress[] memory data) onlyOwner public {
        _setAddress(data);
    }

    function setAddress(ContractTypes _type, address _address) onlyOwner public {
        _setAddress(_type, _address);
    }

    function _setAddress(ContractTypes _type, address _address) internal {
        addressByType[_type] = _address;
    }

    function _setAddress(TypeAndAddress[] memory data) internal {
        for (uint256 i; i < data.length; i++) {
            _setAddress(data[i].contractType, data[i].contractAddress);
        }
    }
}
