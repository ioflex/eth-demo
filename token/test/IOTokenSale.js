const IOTokenSale = artifacts.require("./IOTokenSale.sol");

contract("IOTokenSale", function(accounts){
    var base;
    var tokenPrice = 1000000000000000; // in wei

    it("initializes the contract with the correct values.", function(){
        return IOTokenSale.deployed().then(function(instance){
            base = instance;
            return base.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has a contract address.');
            return base.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has a token contract address.')
            return base.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'token price is correct.');
        });
    });
});