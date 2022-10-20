import { HardhatRuntimeEnvironment} from "hardhat/types";
import { task } from "hardhat/config";

const grantRole = task("grant-role", "")
  .addParam("contract", "")
  .addParam("role", "")
  .addParam("account", "")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    // @ts-ignore
    const contract = await hre.ethers.getContractAt(
      "MarketplaceNFT",
      taskArgs.contract
    );
    
    const role = hre.ethers.utils.keccak256(
        hre.ethers.utils.toUtf8Bytes(taskArgs.role)
    );
    
    const transaction = await contract.grantRole(role, taskArgs.account);
    const receipt = await transaction.wait();
    
    console.log(receipt)
  })

export default grantRole;
