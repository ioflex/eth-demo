pragma solidity >=0.4.21 <0.6.0;

// *** Token contract ***
// *** Used to define the ECR20 token ***
contract IOToken {

    // *** Total supply of of tokens ***
    uint256 public totalSupply;

    // *** Constructor ***
    constructor () public {

        // *** Set the total number of possible tokens ***
        totalSupply = 1000000;
    }
}