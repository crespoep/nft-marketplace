module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const MarketplaceNFT = await deploy("MarketplaceNFT", {
    from: deployer,
    args: ["MyNFTs", "MNFT", 1000],
    log: true,
  });
  console.log("MarketplaceNFT contract: ", MarketplaceNFT.address);
};

module.exports.tags = ["all", "test"];
