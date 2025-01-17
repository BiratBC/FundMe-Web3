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
    hardhat: {},
    holesky: {
      url: HOLESKY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 17000,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts : already hardhat accounts
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false, //true for gas reporter
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
  },
  namedAccounts : {
    deployer : {
      default : 0, //network : deployer account in the above array of accounts
    },
    users : {
      default : 0
    }
  }
};
