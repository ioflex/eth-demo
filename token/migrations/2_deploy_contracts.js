// *** Reference to the IOToken contract ***
const IOToken = artifacts.require("./IOToken.sol");
const IOTokenSale = artifacts.require("./IOTokenSale.sol")

module.exports = function(deployer) {
  deployer.deploy(IOToken, 1000000).then(function(){
    var tokenPrice = 1000000000000000;
    return deployer.deploy(IOTokenSale, IOToken.address, tokenPrice);
  });
};
