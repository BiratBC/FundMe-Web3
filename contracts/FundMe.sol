//GET FUNDS FROM USERS
//WITHDRAW FUNDS
//SET MINIMUM FUNDING VALUE

//WE WANT THE ONE WHO DEPLOY THIS CONTRACT BE THE OWNER OF THIS FUND ME

// SPDX-License-Identifier: MIT

//Pragma
pragma solidity ^0.8.8;

//Imports
import "../contracts/PriceConverter.sol";

//Error Codes
//error contractName__ErrorName
error FundMe__NotOwner(); //replacing require with this will save more gas, this is a custom error name

//Interfaces, Libraries, Contracts
// Doxygen style

/**
 * @title A contract for crowd funding
 * @author Birat BC
 * @notice This contract is to demo a sample funding contract
 * @dev This implements priceFeeds as our library to get current price feed for eth/usd
 */
contract FundMe {
    //constant , immutable
    using PriceConverter for uint256; //using PriceConverter Library in this file and we can use all the functions inside PriceConverter Library takes uint256

    uint256 public constant MINIMUM_USD = 50 * 10**18; //this is in wei

    //State Variables -> these state or storage variables are stored in Storage as a large list of array
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded; //creating a map[key value pair] to track the record of amount sent by funders with their name

    //Owner
    address public immutable i_owner; //naming convention for immutable variable i_

    //Creating an object of AggregatorV3 to pass address of different data feeds while converting
    AggregatorV3Interface public s_priceFeed;
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }

        _; //its like next() or run the other code
    }

    constructor(address priceFeedAddress) {
        //Here the priceFeedAddress depends upon the chain network on which the deployer of this contract is
        i_owner = msg.sender; //msg.sender contains the address of the deployment address of this contract
        s_priceFeed = AggregatorV3Interface(priceFeedAddress); //get the price feeed  of the network in which this contract is deployed
    }

    /**
     * @notice This function funds this contract
     * @dev This implements price feed library which uses Price Converter library
     */

    function fund() public payable {
        //Want to set a minimum fund amount in USD
        //1. How do we send ETH to this contract?
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You have to atleast send 1 ETH"
        ); //to get the value of what user is sending , its global
        s_funders.push(msg.sender); //pushes the sendeers address to the funders stack
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        // require(msg.sender == owner, "Sender is not owner");

        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0; //the amount to the funder's address will be set to 0
        }
        //reset the array funders
        s_funders = new address[](0); //cleaning the memory
        //actually withdraw the amount

        //NATIVE FUNCTIONS TO SEND MONEY : transfer, send and call

        //transfer -> returns error
        //msg.sender = address
        //payble(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance); //this is the way of sending eth from this contract address(this) means whole contract
        // send -> returns -= bool
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "send Failed");
        //call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call Failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders; //memory uses cheap gas price while storage uses huge gas price
        //mappings not available in memory

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            //Resetting all the funded money to zero
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    //Getter functions
    //1. get Owner
    function getOwner() public view returns (address) {
        return i_owner;
    }

    //2. get funder
    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    //3. get ammount funded from respective accounts

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    //4. get price feed

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }



    

    //WHAT HAPPENS IF SOMEONE  SENDS THIS CONTRACT ETH WITHOUT CALLING THE FUND FUNCTION WHICH CAN BE POSSIBLE

    //fallback()
    //receive()

    //if someone accidently sends us money without calling the fuind() function these two advance function will divert to call the funde function
    //automatically
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
