import { ethers } from "hardhat";

async function main() {
    await ethers.provider.send('hardhat_reset');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
