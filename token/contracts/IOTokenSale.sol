pragma solidity >=0.4.21 <0.6.0;

import "./IOToken.sol";

contract IOTokenSale {
    // *** Administrator of the IOTokenSale contract ***
    // *** State variable ***
    address payable admin;

    IOToken public tokenContract;

    // *** Token price set by Admin ***
    uint256 public tokenPrice;

    // *** Number of tokens sold by contract ***
    uint256 public tokensSold;

    // *** Sell event ***
    event Sell(address _buyer, uint256 _amount);

    constructor (IOToken _tokenContract, uint256 _tokenPrice) public {
        // *** Assign an admin ***
        // *** Admin is the user who deploys the contract ***
        admin = msg.sender;

        // *** Assign token contract ***
        tokenContract = _tokenContract;

        // *** Set the token price ***
        tokenPrice = _tokenPrice;
    }

    function multiply(uint _x, uint _y) internal pure returns(uint z) {
        require(_y == 0 || (z = _x * _y) / _y == _x, "failed to multiply the values.");
    }

    /**
     * Allows an address to buy a specific number of tokens.
     * Ether amount equals the required token cost.
     * Balance of contract tokens is equal to or greater than requested number of tokens.
     * Successful transfer.
     * Sell Event
     */
    function buyTokens(uint256 _numberOfTokens) public payable{
        // *** require that value is equal to tokens ***
        require(msg.value == multiply(_numberOfTokens, tokenPrice), "ether provided does not match actual cost");
        // *** require that the contract has enough tokens to sell ***
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "not enough tokens are available in the smart contract");
        // *** require that a transfer is successful ***
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "transfer must execute");
        // *** Keep track of tokens sold ***
        tokensSold += _numberOfTokens;

        // *** Trigger sell event ***
        emit Sell(msg.sender, _numberOfTokens);
    }

    /**
     * Allows the token sale admin to end the sale.
     * Administrator
     * Transfer remaining tokens to Administrator
     */
    function endSale() public {
        // *** Require admin ***
        require(msg.sender == admin, "sender must be admin user");

        // *** xfer the remaining IOTOkens to the admin ***
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), "transfer required.");

        // *** Destroy contract ***
        selfdestruct(admin);
    }
}