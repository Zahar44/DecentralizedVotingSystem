//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import { ERC721Enumerable, ERC721 } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { ProtocolBase } from "./ProtocolBase.sol";

contract VotingSystem is ERC721Enumerable, ProtocolBase {
    string internal uri;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        address _protocol
    ) ERC721(_name, _symbol) ProtocolBase(_protocol) {
        uri = _uri;
    }

    function createVoting() external {
        _mint(msg.sender, totalSupply());
    }

    function _baseURI() internal view override returns(string memory) {
        return uri;
    }
}
