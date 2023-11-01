//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ProtocolBased } from "./ProtocolBased.sol";

contract VotingToken is ERC20, ProtocolBased {
    constructor(
        string memory _name,
        string memory _symbol,
        address _protocol
    ) ERC20(_name, _symbol) ProtocolBased(_protocol) {}

    function mint(address to, uint256 amount) checkPermissions(mintVotingPower) external {
        _mint(to, amount);
    }
    
    fallback() external {}
}
