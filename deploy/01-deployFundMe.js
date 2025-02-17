// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments } = hre;
// }

const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  console.log(network.name);
  console.log(chainId);

  //THIS WILL RUN IF WE ARE IN DEVELOPMENT CHAIN {LIKE WE ARE IN LOCAL NETWORK OR HARDHAT NETWORK}
  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    //OTHERWISE WE WILL DEPLOY OUR CONTRACT IN TESTNET {LIKE SEPOLIA , HOLESKY} AS THEY HAVE THEIR OWN FEED ADDRESS TO CONVERT ETH TO USD
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  //if the contract doesnt exist, we ddeploy a minimal version of it for our local testing

  //when going for localhost or hardhat network we want to use a mock

  let args = [ethUsdPriceFeedAddress];
  //NAME OF THE CONTRACT IS FUNDME HERE
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, //put price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }

  console.log(
    "--------------------------------------------------------------------------------------"
  );
};
module.exports.tags = ["all", "fundme"];
