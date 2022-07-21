/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    kovan: {
      url: process.env.KOVAN_URL || "",
      chainId: 42,
      accounts: [
        process.env.PRIVATE_KEY_DEPLOYER,
        process.env.PRIVATE_KEY_USER_2
      ].filter(
        (x) => x !== undefined
      ),
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
      4: 0,
    },
    user2: {
      default: 1,
      4: 1,
    },
    user3: {
      default: 2,
      4: 2,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
    test: {
      tasks: ["test"],
      files: ["./test/**/*", "./contracts"],
      verbose: true,
    },
  },
};
