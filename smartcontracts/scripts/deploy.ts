import { ethers } from "hardhat";
import { Protocol } from "../typechain-types";

async function main() {

  const protocolContractArgs: Protocol.TypeAndAddressStruct[] = [];
  let contractType = 0;

  const votingToken = await ethers.deployContract("VotingToken", ["VotingToken", "VT"]);
  await votingToken.waitForDeployment();

  protocolContractArgs.push({
    contractType: contractType++,
    contractAddress: votingToken.target,
  });

  const protocolContractFactory = await ethers.getContractFactory('Protocol');
  const protocolContractDeployTx = await protocolContractFactory.deploy(protocolContractArgs);
  await protocolContractDeployTx.waitForDeployment();
  const t = protocolContractDeployTx.interface.encodeFunctionData("getContractAddress", [0]);
  console.log(t);

  console.log(`Protocol deployed: ${await protocolContractDeployTx.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
