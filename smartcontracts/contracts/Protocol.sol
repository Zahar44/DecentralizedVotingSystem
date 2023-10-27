//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ProtocolPermission } from "./ProtocolPermission.sol";
import { IProtocol } from "./IProtocol.sol";

contract Protocol is IProtocol, ProtocolPermission {
    mapping(address => uint32) permissionsByUser;
    mapping(ContractTypes => address) addressByType; 

    modifier checkPermissions(uint64 permissions) {
        require((permissionsByUser[msg.sender] & permissions) != 0, "Not allowed");
        _;
    }

    constructor() {
        permissionsByUser[msg.sender] = allPermissions;
    }

    function getContractAddress(ContractTypes _type) external view returns(address) {
        return addressByType[_type];
    }

    function getPermissions(address user) external view returns(uint32) {
        return permissionsByUser[user];
    }

    function setPermissions(address _user, uint32 _permissions) external {
        permissionsByUser[_user] = _permissions;
    }

    function setAddress(TypeAndAddress[] memory data) checkPermissions(modifyAddressPermission) public {
        _setAddress(data);
    }

    function setAddress(ContractTypes _type, address _address) checkPermissions(modifyAddressPermission) public {
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
