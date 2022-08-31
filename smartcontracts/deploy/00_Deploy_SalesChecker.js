module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const salesOrderCheckerContract = await deploy("SalesOrderChecker", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("SalesOrderChecker contract: ", salesOrderCheckerContract.address)
};

module.exports.tags = ["all", "test"];
