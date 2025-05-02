import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const BRBToken = await ethers.getContractFactory("BRBToken");

  // Get the default signer
  const [signer] = await ethers.getSigners();

  console.log("Deploying BRBToken contract...");

  const BRBContract = (await BRBToken.connect(signer).deploy());
  await BRBContract.waitForDeployment();
  const BRBContractDeployedAddress = await BRBContract.getAddress();
}

// Run the deployment script
main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exitCode = 1;
});