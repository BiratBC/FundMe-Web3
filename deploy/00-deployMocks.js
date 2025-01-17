//WHEN WE ARE DEPLOYING CONTRACT IN OUR LOCAL HOST 
const { network } = require("hardhat");
// const {networkConfig} = require("../helper-hardhat-config");
const {developmentChains, DECIMALS, INTIAL_ANSWERS} = require("../helper-hardhat-config");

module.exports = async ({getNamedAccounts, deployments}) => {

    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    console.log(chainId);
    if (developmentChains.includes(network.name)) {
        console.log("Local networks detected! Deploying mocks.....");
        await deploy("MockV3Aggregator",{
            contract : "MockV3Aggregator",
            from : deployer,
            log : true,
            args : [DECIMALS, INTIAL_ANSWERS]
        });
        console.log("Mocks Deployed");
        console.log("----------------------------------------------------");

        
    }

}

module.exports.tags = ["all", "mocks"] //this is to run this file only so it wont run other deploy files if local network or hardhat network is detected
// use --tags mocks