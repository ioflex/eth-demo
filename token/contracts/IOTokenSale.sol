pragma solidity >=0.4.21 <0.6.0;

import "./IOToken.sol";

contract IOTokenSale {
    // *** Administrator of the IOTokenSale contract ***
    // *** State variable ***
    address admin;

    IOToken public tokenContract;

    uint256 public tokenPrice;

    constructor (IOToken _tokenContract, uint256 _tokenPrice) public {
        // *** Assign an admin ***
        // *** Admin is the user who deploys the contract ***
        admin = msg.sender;

        // *** Assign token contract ***
        tokenContract = _tokenContract;

        // *** Set the token price ***
        tokenPrice = _tokenPrice;
    }
}