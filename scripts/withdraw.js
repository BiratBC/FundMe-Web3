const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const fundMeDeployment = await deployments.get("FundMe");
  const fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
  console.log("Withdrawing.......");
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait();
  console.log("Withdraw successfull!!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
