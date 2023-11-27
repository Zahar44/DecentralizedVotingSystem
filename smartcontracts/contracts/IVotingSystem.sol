//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface IVotingSystem {
    struct CreateVotingProps {
        string name;
        string description;
        uint256 price;
        address treasury;
    }

    event VotingCreated(address indexed issuer, uint256 projectId, CreateVotingProps props);
    event Voted(address indexed issuer, uint256 projectId, uint256 amount);

    function createVoting(CreateVotingProps calldata props) external;
}
