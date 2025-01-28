const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      //the outer describe block must not be async
      //this is for whole fundme contract

      let fundMe;
      let deployer;
      let mockV3Aggregator;
      const sendValue = ethers.parseEther("2");

      //BEFORE EACH WILL RUN BEFORE OTHER DESCRIBE IN THIS NESTED DESCRIBE
      beforeEach(async () => {
        //first deploy our fundme contract
        //using hardhat-deploy
        deployer = (await getNamedAccounts()).deployer;

        await deployments.fixture(["all"]); //allows us to run our entire deploy folder with multiple tags
        const fundMeDeployment = await deployments.get("FundMe");
        // console.log(fundMeDeployment);
        console.log("This is deployer", deployer);

        const mockV3AggregatorDeployment = await deployments.get(
          "MockV3Aggregator"
        );
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address); //here the fundeMeDeployment.address is the address of fundme contract itself not the address of deployer
        mockV3Aggregator = await ethers.getContractAt(
          "MockV3Aggregator",
          mockV3AggregatorDeployment.address
        );
        console.log(fundMeDeployment.address);
        console.log(mockV3AggregatorDeployment.address);
      });

      describe("constructer", async () => {
        //this is just for constructor of fundme contract
        it("Sets the aggregator addresses correctly", async () => {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.target);
        });
      });

      describe("fund", async () => {
        //this is for fund function
        it("It fails if youe dont send enough eth", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You have to atleast send 1 ETH"
          ); //if this error found, let it pass the test
        });
        it("Updates the amount funded data structure", async () => {
          //i.e getAddressToAmountFunded
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
        it("Add funder to array of getFunder", async () => {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunder(0);
          assert(funder, deployer);
        });
      });

      describe("withdraw", async () => {
        //funding the contract first and populating the getFunder array
        this.beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        it("withdraw eth from a single funder", async () => {
          //Arrange
          //Staring balance of fundME contract
          const startingFundMeBalance = await ethers.provider.getBalance(
            //its ethers.provider not fundMe.provider
            fundMe.target
          );
          //Starting balance of deployer contract
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          //Act

          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);

          //get GAS COST
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          //Assert
          assert.equal(endingFundMeBalance, 0); //as we withdrew all money from fundMe Contract
          assert.equal(
            startingDeployerBalance + startingFundMeBalance, //starting fundMe balance is transferred to starting deployer balance
            endingDeployerBalance + gasCost
          );
        });
        it("allows us to withdraw with multiple getFunder", async () => {
          const accounts = await ethers.getSigners();
          console.log(`Accounts : ${accounts}`);

          for (let index = 0; index < 6; index++) {
            const fundMeConnectedContract = await fundMe.connect(
              accounts[index]
            );
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundMeBalance = await ethers.provider.getBalance(
            //its ethers.provider not fundMe.provider
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          //Act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;
          console.log(`Gas Used : ${gasUsed}`);
          console.log(`Gas Used : ${gasPrice}`);

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          //Assert
          assert.equal(endingFundMeBalance, 0); //as we withdrew all money from fundMe Contract
          assert.equal(
            startingDeployerBalance + startingFundMeBalance, //starting fundMe balance is transferred to starting deployer balance
            endingDeployerBalance + gasCost
          );

          //Make sure that the getFunder are reset properly

          await expect(fundMe.getFunder(0)).to.be.reverted;

          for (let index = 1; index < 6; index++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[index].address),
              0
            );
          }
        });
        //only allows owner to withdraw
        it("only allows owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          //const attacker = accounts[1]; //this means when other account tries to withdraw the function call gets reverted
          const fundMeConnectedContract = await fundMe.connect(accounts[2]);
          await expect(
            fundMeConnectedContract.cheaperWithdraw()
          ).to.be.revertedWithCustomError(
            fundMeConnectedContract,
            "FundMe__NotOwner"
          );
          console.log();
        });

        //cheaperWithdraw Test
        it("cheaper withdraw testing", async () => {
          const accounts = await ethers.getSigners();
          console.log(`Accounts : ${accounts}`);

          for (let index = 0; index < 6; index++) {
            const fundMeConnectedContract = await fundMe.connect(
              accounts[index]
            );
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundMeBalance = await ethers.provider.getBalance(
            //its ethers.provider not fundMe.provider
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          //Act
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;
          console.log(`Gas Used : ${gasUsed}`);
          console.log(`Gas Used : ${gasPrice}`);

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          //Assert
          assert.equal(endingFundMeBalance, 0); //as we withdrew all money from fundMe Contract
          assert.equal(
            startingDeployerBalance + startingFundMeBalance, //starting fundMe balance is transferred to starting deployer balance
            endingDeployerBalance + gasCost
          );

          //Make sure that the getFunder are reset properly

          await expect(fundMe.getFunder(0)).to.be.reverted;

          for (let index = 1; index < 6; index++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[index].address),
              0
            );
          }
        });
      });
    });
