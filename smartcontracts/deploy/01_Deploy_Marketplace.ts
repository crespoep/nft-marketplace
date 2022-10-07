import { DeployFunction } from "hardhat-deploy/dist/types";
const { networkConfig } = require("../helper-hardhat-config");
import { BigNumber } from "ethers";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const platformFee = networkConfig[chainId].platformFee;

  const Marketplace = await deploy("Marketplace", {
    from: deployer,
    args: [BigNumber.from(platformFee)],
    log: true,
  });

  console.log("Marketplace contract: ", Marketplace.address);
};

export default func;
func.tags = ["all", "test"];
