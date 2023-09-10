/*
 * @Descripttion: 
 * @version: 
 * @Author: Mindy
 * @Date: 2023-09-01 16:29:15
 */
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/cf25bc9652db4640b83e23517e8e5594",
      accounts: ["908cb93129f920d7f9575962e074b5591cf0e19540041ca147bae7dbf53569b9"]
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
