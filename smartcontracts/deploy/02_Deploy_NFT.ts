import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const MarketplaceNFT = await deploy("MarketplaceNFT", {
    from: deployer,
    args: ["MyNFTs", "MNFT", 1000],
    log: true,
  });
  console.log("MarketplaceNFT contract: ", MarketplaceNFT.address);
};

export default func;
func.tags = ["all", "test"];
