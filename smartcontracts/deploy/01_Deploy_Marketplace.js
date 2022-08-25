const {BigNumber} = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Marketplace", {
    from: deployer,
    args: [
      BigNumber.from(3)
    ],
    log: true,
  });
};

module.exports.tags = ["all", "test"];
