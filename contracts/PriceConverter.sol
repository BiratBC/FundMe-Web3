// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import"@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
library PriceConverter {
     function getPrice() view public returns  (uint256){
        //ABI 
        //Address : 0x694AA1769357215DE4FAC081bf1f309aDC325306 (eth to usd for sepolia)
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
       (, int256 price, , , ) = priceFeed.latestRoundData();
       //ETH in terms of USD
       return  uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount) view public returns (uint256){
        uint256 ethPrice = getPrice();
        return (ethPrice * ethAmount) / 1e18;
    }

    function getVersion() public view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return priceFeed.version();
    }
}