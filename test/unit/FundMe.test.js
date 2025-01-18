const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert } = require("chai");

describe("FundMe", async () => {
  //this is for whole fundme contract

  let fundMe;
  let deployer;
  let mockV3Aggregator;
  beforeEach(async () => {
    //first deploy our fundme contract
    //using hardhat-deploy
    deployer = (await getNamedAccounts()).deployer;
    
    await deployments.fixture(["all"]); //allows us to run our entire deploy folder with multiple tags
    const fundMeDeployment = await deployments.get("FundMe");
    // console.log(fundMeDeployment);
    console.log("This is deployer",deployer);
    
    
    const mockV3AggregatorDeployment = await deployments.get(
      "MockV3Aggregator"
    );
    fundMe = await ethers.getContract("FundMe", fundMeDeployment.address);
    mockV3Aggregator = await ethers.getContract(
      "MockV3Aggregator",
      mockV3AggregatorDeployment.address
    );
    console.log(fundMeDeployment.address);
    console.log(mockV3AggregatorDeployment.address);
    
  });

  describe("constructer", async () => {
    //this is just for constructor of fundme contract
    it("Sets the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();      
      assert.equal(response, mockV3Aggregator.target);
    });
  });
});
