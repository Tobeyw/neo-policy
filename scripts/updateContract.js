
const hre = require("hardhat");
const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");



const ProxyAdmin = "0xd4055f38eca6f341c10be577210175fe630adf4b"

async function main() {

  const  signer  = await hre.ethers.provider.getSigner()
  const provider = await hre.ethers.provider
  // console.log(provider)
  const proxyAdminabi = await hre.artifacts.readArtifact("ProxyAdmin");

  const proxyAdminContract =new hre.ethers.Contract(ProxyAdmin,proxyAdminabi.abi,provider)
  const ProxyAdminWithSigner = proxyAdminContract.connect(signer)
  const  add = await ProxyAdminWithSigner.getAddress()
  console.log("contract address is",add)

 
 //查询owner
  const result = await proxyAdminContract.owner();
  console.log("owner is:",result.toString());
 

  const newMulti = "0xf0d3b0f1dd784a4a482e19e04221a99d71e71710"     
  const multiProxyAddress = "0xe7653482e5bc0f13d60774affa8bc2a4693a796c"

  // 更新逻辑合约地址
   const result1 = await ProxyAdminWithSigner.upgrade(multiProxyAddress,newMulti);

  // //查逻辑合约地址
  const getProxyImplementation = await ProxyAdminWithSigner.getProxyImplementation(multiProxyAddress);
  console.log("getproxyImplementation:",getProxyImplementation.toString()); //0x0Cd213b5E4641db18AAE9650A79d4FB9F091267D

 
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
