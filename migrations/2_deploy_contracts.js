var TodoList = artifacts.require("./TodoList.sol");
var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  // deployer.deploy(TodoList);
  deployer.deploy(Election);
};