import { HardhatRuntimeEnvironment} from "hardhat/types";
import { task } from "hardhat/config";
import {BigNumber} from "ethers";

const addItem = task("add-item", "")
  .addParam("contract", "Marketplace contract address")
  .addParam("user", "")
  .addParam("nftcontract", "NFT contract address")
  .addParam("tokenid", "")
  .addParam("price", "")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    // @ts-ignore
    const ethers = hre.ethers;
    
    const contract = await ethers.getContractAt(
      "Marketplace",
      taskArgs.contract
    );
  
    const signer = await ethers.getSigner(taskArgs.user)

    const transaction = await contract.connect(signer).addItem(
      taskArgs.nftcontract,
      parseInt(taskArgs.tokenid),
      BigNumber.from(taskArgs.price)
    );
    const receipt = await transaction.wait();
    
    console.log(receipt)
  })

export default addItem;
