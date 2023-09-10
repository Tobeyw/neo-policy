
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const multi = "0xA83e88525eAaA73bC831455A2A6b41F88eEC1e75"
  const Policy = await hre.ethers.deployContract("Policy");

  await Policy.waitForDeployment();

  console.log(
    `Policy deployed to ${Policy.target}`   //0x0866f1e7dec725e26cdc2cc5e181a2ec48da7783
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
