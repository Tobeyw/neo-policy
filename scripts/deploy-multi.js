const hre = require("hardhat");

async function main() {
 
  const multi = "0xA83e88525eAaA73bC831455A2A6b41F88eEC1e75"
  const _owners = ["0x42869a360781E77AE1F63Be4f85e364eF77C66Ac","0xA83e88525eAaA73bC831455A2A6b41F88eEC1e75"]
  const _numConfirmationsRequired = 2;
  const Policy = await hre.ethers.deployContract("MultiSigWallet");

  await Policy.waitForDeployment();

  console.log(
    `multi deployed to ${Policy.target}`    //0x46b7bc5e5cfcec7098c34be942ff6b3e9ddf43f1
  );                                        //update 0x77d51D4A9b731B5Fcd22C0142217D4bCE0023b85  0xf0d3b0f1dd784a4a482e19e04221a99d71e71710
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
