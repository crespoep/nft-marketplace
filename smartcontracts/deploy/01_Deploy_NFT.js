module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("NFT", {
    from: deployer,
    args: [
      "MyNFTs",
      "MNFT",
      1000
    ],
    log: true,
  });
};

module.exports.tags = ["all"];
