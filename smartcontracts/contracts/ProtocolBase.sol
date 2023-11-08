//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import { IProtocol } from "./IProtocol.sol";
import { ProtocolPermission } from "./ProtocolPermission.sol";

abstract contract ProtocolBase is ProtocolPermission {
    IProtocol protocol;

    modifier checkPermissions(uint64 _permissions) {
        uint32 permissions = protocol.getPermissions(msg.sender);
        require((permissions & _permissions) != 0, "Not allowed");
        _;
    }

    constructor(address _protocol) {
        protocol = IProtocol(_protocol);
    }
}
