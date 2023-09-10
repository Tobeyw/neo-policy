

const {hre} = require("hardhat");

async function main() {   
  const multi = "0x0cd213b5e4641db18aae9650a79d4fb9f091267d"
  const ProxyAdmin = "0xd4055f38eca6f341c10be577210175fe630adf4b"

 
  const lock = await hre.ethers.deployContract("MultiSigProxy",[multi,ProxyAdmin]);

  await lock.waitForDeployment();

  console.log(
    `deployed to ${lock.target}`     //const Proxy = "0xe7653482e5bc0f13d60774affa8bc2a4693a796c"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
