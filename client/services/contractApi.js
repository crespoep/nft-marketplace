import { initContract } from "./ethereumConnectionManager";
import data from "../services/contracts.json";

const getLastCreated = async () => {
  const { contract } = await initContract(data.contracts.Marketplace, data.contracts.Marketplace.abi);

  return [];
}

const createNFT = async (tokenURI) => {
  const { contract, signer, signerAddress } = await initContract(data.contracts.MarketplaceNFT.address, data.contracts.MarketplaceNFT.abi);
  const transaction = await contract.connect(signer).mint(signerAddress, tokenURI)
  return await transaction.wait();
}

export {
  createNFT,
  getLastCreated
}
