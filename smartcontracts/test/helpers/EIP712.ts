import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

export const createSalesOrder = async (
  marketplaceContractAddress: string,
  nftContractAddress: string,
  tokenId: number,
  price: object,
  tokenURI: string,
  chainId: number,
  signer: SignerWithAddress
) => {
  
  const { domain, types, salesOrder: _salesOrder } = await buildSalesOrder(
    marketplaceContractAddress, nftContractAddress, tokenId, price, tokenURI, signer.address, chainId
  );
  
  const signature = await signer._signTypedData(domain, types, _salesOrder);
  
  return {..._salesOrder, signature};
}

const buildSalesOrder = async (
  marketplaceAddress: string,
  nftContractAddress: string,
  tokenId: number,
  price: object,
  tokenURI: string,
  tokenOwner: string,
  chainId: number
) => {
  const domain = {
    name: "LAZY_MARKETPLACE",
    version: "1",
    verifyingContract: marketplaceAddress,
    chainId: chainId
  }

  const types = {
    SalesOrder: [
      { name: "contractAddress", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "tokenOwner", type: "address" },
      { name: "price", type: "uint256" },
      { name: "tokenURI", type: "string" }
    ]
  }

  const salesOrder = {
    contractAddress: nftContractAddress,
    tokenId: tokenId,
    tokenOwner: tokenOwner,
    price: price,
    tokenURI: tokenURI
  }

  return { domain, types, salesOrder }
}
