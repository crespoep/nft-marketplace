import marketplaceContractAddress from "../contracts/Marketplace/contract-address.json";
import MarketplaceArtifact from "../contracts/Marketplace/NFTMarketplace.json";
import { initContract } from "./ethereumConnectionManager";
import { buildSalesOrder } from "./EIP712";

const createSalesOrder = async nftItem => {
  const {
    contract: marketplaceContract,
    chainId,
    signer,
    signerAddress: tokenOwner
  } = await initContract(marketplaceContractAddress, MarketplaceArtifact.abi)

  // const nonce = await marketplaceContract.getCurrentSalesOrderNonce(tokenOwner)
  const nonce = 1;

  const { domain, types, salesOrder: _salesOrder } = await buildSalesOrder(marketplaceContractAddress, nftItem, tokenOwner, chainId, nonce);

  const signature = await signer._signTypedData(domain, types, _salesOrder);

  const salesOrder = {..._salesOrder, signature};

  return { salesOrder };
}

export {
  createSalesOrder
}
