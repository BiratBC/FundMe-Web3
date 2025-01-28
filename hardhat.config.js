require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */

const HOLESKY_RPC_URL =
  process.env.HOLESKY_RPC_URL || "https://eth-holesky/example";
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL || "https://eth-sepolia/example";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";

module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    // holesky: {
    //   url: HOLESKY_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 17000,
    //   blockConfirmations: 6 //number of block to be confirmed for deployment
    // },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    holesky : {
      url : HOLESKY_RPC_URL,
      accounts : [PRIVATE_KEY],
      chainId : 17000
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true, //true for gas reporter
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
  },
  namedAccounts : {
    deployer : {
      default : 0, //network : deployer account in the above array of accounts
    },
    // users : {
    //   default : 0
    // }
  }
};
