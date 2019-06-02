const IOToken = artifacts.require("./IOToken.sol");
const IOTokenSale = artifacts.require("./IOTokenSale.sol");

contract("IOTokenSale", function(accounts){
    // *** IO Token Sale instance ***
    let base;
    // *** IO Token instance ***
    let token;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokenPrice = 1000000000000000; // in wei
    let numberOfTokens = 10;
    let tokensAvailable = 750000;

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

    it("facilitates token buying", function(){
        return IOToken.deployed().then(function(instance){
            token = instance;
            return IOTokenSale.deployed();
        }).then(function(instance){
            // *** get the iotoken sale instance ***
            base = instance;
            // *** provision 75% of totalSupply to TokenSaleContract.
            return token.transfer(base.address, tokensAvailable, {from: admin});
        }).then(function(receipt){
            return base.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, "Sell", 'the event triggered is the "Sell" event.');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens.');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased.');
            return base.tokensSold();
        }).then(function(amountSold){
            assert.equal(amountSold.toNumber(), numberOfTokens);
            return token.balanceOf(buyer);
        }).then(function(balance){
            assert.equal(balance.toNumber(), numberOfTokens, 'buyer balance is correct after buy.');
            return token.balanceOf(base.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'smart contract balance is correct after sell.');
            // *** Attempt to buy number of tokens different from ether value ***
            return base.buyTokens(numberOfTokens, {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei.');
            return base.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than are available in the contract.');
        });
    });

    it('allows admin to end token sale.', function(){
        return IOToken.deployed().then(function(instance){
            token = instance;
            return IOTokenSale.deployed();
        }).then(function(instance){
            base = instance;
            return base.endSale({ from: buyer });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'must be an admin to end the token sale.');
            return base.endSale({ from: admin });
        }).then(function(receipt){
            console.log(admin);
            return token.balanceOf(admin);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 999990, 'returns all un-sold iotokens to admin.');
            // *** Ensure token price was reset when self destruct is called ***
            return base.tokenPrice();
        }).then(function(price){
            assert.equal(price.toNumber(), 0, 'token price was reset.');
        });
    });
}); 