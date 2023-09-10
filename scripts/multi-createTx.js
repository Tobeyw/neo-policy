
const hre = require("hardhat");
 
const ethers = require("ethers");
 

const multiProxyAddress = "0xe7653482e5bc0f13d60774affa8bc2a4693a796c"
const PolicyProxyAddress = "0x0585cf3c194432ef94edaf2e82d1166dc9618684"

async function main() {
  const blocknum = await hre.ethers.provider.getBlockNumber()
  console.log(blocknum)

  const  signer  = await hre.ethers.provider.getSigner()
  const provider = await hre.ethers.provider
  // console.log(provider)
  const multiabi = await hre.artifacts.readArtifact("MultiSigWallet");

  const multiWallet =new hre.ethers.Contract(multiProxyAddress,multiabi.abi,provider)
  const  multiWalletWithSigner = multiWallet.connect(signer)
  const  add = await multiWalletWithSigner.getAddress()
  console.log(add)
  //初始化
//   const _owners = ["0x42869a360781E77AE1F63Be4f85e364eF77C66Ac","0xA83e88525eAaA73bC831455A2A6b41F88eEC1e75"]
//   const _numConfirmationsRequired = 2;

//   multiWalletWithSigner.initialize(_owners,_numConfirmationsRequired)     //只能执行一次
 
 //查询owner
  const result = await multiWallet.getOwners();
  console.log("owner is:",result.toString());
 
  const resultnum = await multiWallet.numConfirmationsRequired();
  console.log("numConfirmationsRequired is:",resultnum.toString());
 
  const privateKey = "b5e2af6731cb284258ce331f634b40642dbdb2632a3140272350fe44cb95ed21"  //0x42869a360781E77AE1F63Be4f85e364eF77C66Ac
  const owner1 = new hre.ethers.Wallet(privateKey,provider);

  const privateKey2 = "908cb93129f920d7f9575962e074b5591cf0e19540041ca147bae7dbf53569b9"  //0xA83e88525eAaA73bC831455A2A6b41F88eEC1e75
  const owner2= new hre.ethers.Wallet(privateKey2,provider);
  
  //
  const policyabi = await hre.artifacts.readArtifact("Policy");
  const PolicyWithSigner =new hre.ethers.Contract(PolicyProxyAddress,policyabi.abi,provider)


  
  const selector = ethers.id('setMinGasPrice(uint256)').slice(0, 10);

  console.log("funSig:",selector);
  const amount = 20000000;
  const data = selector + ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [amount]).substring(2);
 
  console.log("data:",data);

  const test = await multiWallet.Test2();
  console.log("test2 is:",test.toString());
 

   
  //提交交易
  //  const result_index = await multiWalletWithSigner.submitTransaction(PolicyProxyAddress,0,data);   
  //  console.log("result_index:",result_index);

  //查询提交交易
  // const result_index = await multiWalletWithSigner.getTransaction(2);   
  // console.log("result_index:",result_index);

   ////owner1 确认交易
  // const  multiWalletWithSigner1 = multiWallet.connect(owner1) 
  // const confirm1 = await multiWalletWithSigner1.confirmTransaction(2);   
  // console.log(confirm1)

  ////owner2 确认交易
  // const  multiWalletWithSigner2 = multiWallet.connect(owner2) 
  // const confirm2 = await multiWalletWithSigner2.confirmTransaction(2);   
  // console.log(confirm2)

  // 执行交易
  // const  multiWalletWithSigner2 = multiWallet.connect(owner2) 
  // const executeTx = await multiWalletWithSigner2.executeTransaction(2);  
  // console.log(executeTx) 

  // 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
