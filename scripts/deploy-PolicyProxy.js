

const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const policy = "0x0866f1e7dec725e26cdc2cc5e181a2ec48da7783"
  const ProxyAdmin = "0xd4055f38eca6f341c10be577210175fe630adf4b"

 
  const lock = await hre.ethers.deployContract("PolicyProxy",[policy,ProxyAdmin]);
 
  await lock.waitForDeployment();

  console.log(
    `deployed to ${lock.target}`     //const Proxy = "0x0585cf3c194432ef94edaf2e82d1166dc9618684"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
