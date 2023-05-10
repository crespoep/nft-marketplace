import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const Marketplace = await get("Marketplace");
  
  const MarketplaceNFT = await deploy("MarketplaceNFT", {
    from: deployer,
    args: ["MyNFTs", "MNFT", 1000, Marketplace.address],
    log: true,
  });
  console.log("MarketplaceNFT contract: ", MarketplaceNFT.address);
};

export default func;
func.tags = ["all", "test"];
