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

    // *** Test normal transfer ***
    it('transfer token ownership', function(){
        return IOToken.deployed().then(function(instance){
            base = instance;
            return base.transfer.call(accounts[1], 999999999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return base.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then(function(success){
            assert.equal(success, true, 'transfer returns true.');
            return base.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'transaction triggers one event.');
            assert.equal(receipt.logs[0].event, "Transfer", 'event should be the "Transfer" event.');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from.');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are received by.');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount.');
            return base.balanceOf(accounts[1]);
        }).then(function(receiverBalance){
            assert.equal(receiverBalance.toNumber(), 250000, 'transfers amount to receiving account.');
            return base.balanceOf(accounts[0]);
        }).then(function(senderBalance){
            assert.equal(senderBalance, 750000, 'deducts amount from sending account.');
        });
    });

    it('approves tokens for delegated transfer', function(){
        return IOToken.deployed().then(function(instance){
            base = instance;
            return base.approve.call(accounts[1], 100);
        }).then(function(success){
            assert.equal(success, true, 'approve delegation returns true.');
            return base.approve(accounts[1], 100, { from: accounts[0] });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'transaction triggers one event.');
            assert.equal(receipt.logs[0].event, "Approval", 'event should be the "Approval" event.');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transferred from.');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are received by.');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount.');
            return base.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer.');
        });
    });

    it('handles tokens for delegated transfer', function(){
        return IOToken.deployed().then(function(instance){
            base = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            
            // *** Transfer tokens to fromAccount ***
            return base.transfer(fromAccount, 100, { from: accounts[0] });
        }).then(function(receipt){
            // *** Approve spending account ***
            // *** Allow spending of 10 tokens for spendingAccount > fromAccount ***
            return base.approve(spendingAccount, 10, { from: fromAccount });
        }).then(function(receipt){
            // *** Attempt to transfer larger _value than senders balance ***
            return base.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, 'larger than balance of spendingAccount.')
            // *** Attempt to transfer _value larger than approved amount ***
            return base.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "larger than allowance to spend from spendingAccount.");
            return base.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(success){
            assert.equal(success, true, 'true result returned from transferFrom on appropriate balance transfer.')
            return base.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'transaction triggers one event.');
            assert.equal(receipt.logs[0].event, "Transfer", 'event should be the "Transfer" event.');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from.');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are received by.');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount.');
            return base.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'deducts proper amount from sending account.');
            return base.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'adds proper amount to receiving account.');
        });
    });
});