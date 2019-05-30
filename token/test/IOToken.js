var IOToken = artifacts.require("./IOToken.sol");

// *** IOToken contract test ***
// *** Input: Accounts provided by GANASH ***
contract('IOToken', function(accounts){
    // *** Reference to an instance of the IOToken contract ***
    var base;

    // *** Test initialization of internal contract values ***
    it('initializes the contract with the correct values', function(){
        return IOToken.deployed().then(function(instance){
            base = instance;
            return base.name();
        }).then(function(name){
            assert.equal(name, "Input Output Flexibility Token");
            return base.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'IOFT');
            return base.standard();
        }).then(function(standard){
            assert.equal(standard, "Input Output Flexibility Token v1.0.0")
        });
    });

    // *** Test initial Supply / Allocation ***
    it('allocates the initial supply upon deployment', function(){
        return IOToken.deployed().then(function(instance){
            base = instance;
            return base.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
            return base.balanceOf.call(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'initial supply allocated to admin');
        });
    });

    it('transfer token ownership', function(){
        return IOToken.deployed().then(function(instance){
            base = instance;
            return base.transfer.call(accounts[1], 999999999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        });
    });
});