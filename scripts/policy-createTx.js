
const hre = require("hardhat");
const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");

const PolicyProxyAddress = "0x0585cf3c194432ef94edaf2e82d1166dc9618684"

async function main() {
  const blocknum = await hre.ethers.provider.getBlockNumber()
  console.log(blocknum)
  const  signer  = await hre.ethers.provider.getSigner()
  const provider = await hre.ethers.provider
  // console.log(provider)
  const policyabi = await hre.artifacts.readArtifact("Policy");

  const Policy =new hre.ethers.Contract(PolicyProxyAddress,policyabi.abi,provider)
  const  PolicyWithSigner = Policy.connect(signer)
  
  //初始化
   const _multi = "0xe7653482e5bc0f13d60774affa8bc2a4693a796c"  
  //  PolicyWithSigner.initialize(_multi)     //只能执行一次
 
  

 //查询owner
  const result = await Policy.getOwner();
  console.log("owner is:",result.toString());
 
  //查地址有没有被加入黑名单
  const isBlackListedd = await Policy.isBlackListedd(signer);
  console.log("isBlackListedd:",isBlackListedd.toString());

    //查询最低Gas 价格
  const GetminGas = await Policy.getMinGasPrice();
   console.log("GetMInGasPrice:",GetminGas.toString());
 

  const privateKey = "b5e2af6731cb284258ce331f634b40642dbdb2632a3140272350fe44cb95ed21"
  const owner = new hre.ethers.Wallet(privateKey,provider);
  
  const  PolicyWithMultiSigner = Policy.connect(signer)
   
  // const policyTx = await PolicyWithMultiSigner.transferOwnership(_multi);
  // const feeData = await provider.getFeeData()
  // const gasLimit = await provider.estimateGas();
  // tx = {
  //   nonce: nonce,
  //   gasLimit: provider.estimateGas(),
  //   gasPrice: feeData.gasPrice,
  //   to: toAddress,
  //   chainId: chainId,
  //   value: amount,
  //   data: ""
  // }

  // let resp = await wallet.sendTransaction(tx);
  // PolicyWithMultiSigner.setBlackList(signer, true);
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
