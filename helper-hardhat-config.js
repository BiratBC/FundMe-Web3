const networkConfig = {
    // 17000 : {
    //     name : "holesky",
    //     ethUsd : 
    // },
    11155111 : {
        name : "sepolia",
        ethUsdPriceFeed : "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INTIAL_ANSWERS = 200000000000
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INTIAL_ANSWERS
}