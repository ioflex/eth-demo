const IOTokenSale = artifacts.require("./IOTokenSale.sol");

contract("IOTokenSale", function(accounts){
    var base;
    it("initializes the contract with the correct values.", function(){
        return IOTokenSale.deployed().then(function(instance){
            base = instance;
            return base.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has a contract address.');
            return base.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has a token contract address.')
        });
    });
});