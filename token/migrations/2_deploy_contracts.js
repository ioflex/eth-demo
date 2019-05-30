// *** Reference to the IOToken contract ***
const IOToken = artifacts.require("./IOToken.sol");

module.exports = function(deployer) {
  deployer.deploy(IOToken, 1000000);
};
