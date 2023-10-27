//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

abstract contract ProtocolPermission {
    uint32 immutable allPermissions             = 0xffffffff;
    uint32 immutable modifyAddressPermission    = 0x0000000f;
    uint32 immutable mintVotingPower            = 0x000000f0;
}
