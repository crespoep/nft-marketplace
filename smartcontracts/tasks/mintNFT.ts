import { HardhatRuntimeEnvironment} from "hardhat/types";
import { task } from "hardhat/config";

const mintNFT = task("mint-nft", "creation of nfts")
  .addParam("contract", "")
  .addParam("user", "")
  .addParam("tokenuri", "")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const contract = await hre.ethers.getContractAt(
      "MarketplaceNFT",
      taskArgs.contract
    );

    const transaction = await contract.mint(taskArgs.user, taskArgs.tokenuri);
    const receipt = await transaction.wait();
    
    console.log(receipt)
  })

export default mintNFT;
