import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";

const approveOperator = task("approve-operator", "")
  .addParam("contract", "")
  .addParam("user", "")
  .addParam("operator", "")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    // @ts-ignore
    const ethers = hre.ethers;
    
    // @ts-ignore
    const contract = await hre.ethers.getContractAt(
      "MarketplaceNFT",
      taskArgs.contract
    );

    const signer = await ethers.getSigner(taskArgs.user)

    const transaction = await contract.connect(signer).setApprovalForAll(taskArgs.operator, true);
    const receipt = await transaction.wait();
    
    console.log(receipt)
  })

export default approveOperator;
