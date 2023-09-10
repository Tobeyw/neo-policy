const ethers = require("ethers");
 


async function main() {
  
  
  // const selector = ethers.id('setMinGasPrice(uint256)').slice(0, 10);
  // console.log("selector:",selector);
  // const amount = 20000000;
  // const data = selector + ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [amount]).substring(2); 
  // console.log("data:",data);

  // const selector = ethers.id('getCurrentPhase()').slice(0, 10);
  const selector = ethers.id('').slice(0, 10);
  console.log("selector:",selector);
   
  const data = selector + ethers.AbiCoder.defaultAbiCoder().encode([],[]).substring(2);
 
  console.log("data:",data);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
