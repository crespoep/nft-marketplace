require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
};
