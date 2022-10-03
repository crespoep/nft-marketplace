require("dotenv").config();
import { HardhatUserConfig } from "hardhat/config";

// Disabled until mocking be developed, using mocking from hardhat-waffle
// import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-waffle";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user1: {
      default: 1,
      4: 1,
    },
    user2: {
      default: 2,
      4: 2,
    },
    user3: {
      default: 3,
      4: 3,
    },
  },
};

export default config;
