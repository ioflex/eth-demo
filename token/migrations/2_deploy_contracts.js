const IOToken = artifacts.require("./IOToken.sol");

module.exports = function(deployer) {
  deployer.deploy(IOToken);
};
