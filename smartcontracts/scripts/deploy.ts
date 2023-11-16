import { ethers } from "hardhat";
import { IProtocol } from "../typechain-types/contracts/Protocol";

async function main() {

    const protocolContractArgs: IProtocol.TypeAndAddressStruct[] = [];
    let contractType = 0;

    const protocolContractFactory = await ethers.getContractFactory('Protocol');
    const protocolContractDeployTx = await protocolContractFactory.deploy();
    await protocolContractDeployTx.waitForDeployment();

    const votingToken = await ethers.deployContract("VotingToken", ["VotingToken", "VT", protocolContractDeployTx.target]);
    await votingToken.waitForDeployment();

    protocolContractArgs.push({
        contractType: contractType++,
        contractAddress: votingToken.target,
    });

    const votingSystem = await ethers.deployContract('VotingSystem', ["Voting", "Voting", 'http://localhost:3000/metadata/', protocolContractDeployTx.target]);
    await votingSystem.waitForDeployment();

    protocolContractArgs.push({
        contractType: contractType++,
        contractAddress: votingSystem.target,
    });

    await protocolContractDeployTx["setAddress((uint8,address)[])"](protocolContractArgs);

    console.log(`Protocol deployed: ${await protocolContractDeployTx.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
