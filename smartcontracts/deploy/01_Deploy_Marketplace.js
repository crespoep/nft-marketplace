const {BigNumber} = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const salesOrderCheckerContract = await deployments.get("SalesOrderChecker")

  const Marketplace = await deploy("Marketplace", {
    from: deployer,
    args: [
      BigNumber.from(3),
      salesOrderCheckerContract.address
    ],
    log: true,
  });

  console.log("Marketplace contract: ", Marketplace.address)
};

module.exports.tags = ["all", "test"];
