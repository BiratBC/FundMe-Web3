const {run} =require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract.....");
    try {
        await run("verify:verify", {
            address : contractAddress,
            constructorArguments : args,
        })

    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
            
        }
        console.error(error.message);
        
    }
}
module.exports = {verify}; //This one if verify is not a function
// module.exports = verify; These both are different this one if verify is a function 