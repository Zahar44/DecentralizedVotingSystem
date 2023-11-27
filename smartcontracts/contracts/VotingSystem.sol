//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC721Enumerable, ERC721 } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { ProtocolBase } from "./ProtocolBase.sol";
import { IVotingSystem } from "./IVotingSystem.sol";
import { IProtocol } from "./IProtocol.sol";

contract VotingSystem is IVotingSystem, ERC721Enumerable, ProtocolBase {
    string internal uri;
    mapping(uint256 => uint256) internal votedForProject;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        address _protocol
    ) ERC721(_name, _symbol) ProtocolBase(_protocol) {
        uri = _uri;
    }

    function createVoting(CreateVotingProps calldata props) external {
        uint256 id = totalSupply() + 1;
        _mint(msg.sender, id);
        emit VotingCreated(msg.sender, id, props);
    }

    function vote(uint256 projectId, uint256 amount) external {
        require(projectId <= totalSupply(), "Project is not exist");

        IERC20 token = IERC20(protocol.getContractAddress(IProtocol.ContractTypes.VotingToken));
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        votedForProject[projectId] += amount;
        emit Voted(msg.sender, projectId, amount);
    }

    function _baseURI() internal view override returns(string memory) {
        return uri;
    }
}
