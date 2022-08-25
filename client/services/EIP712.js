export const buildSalesOrder = async (marketplaceAddress, nftItem, tokenOwner, chainId, nonce) => {
  const domain = {
    name: "LAZY_MARKETPLACE",
    version: "1",
    verifyingContract: marketplaceAddress.NFTMarketplace,
    chainId: chainId
  }

  const types = {
    salesOrder: [
      { name: "contractAddress", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "tokenOwner", type: "address" },
      { name: "price", type: "uint256" },
      { name: "tokenURI", type: "string" },
      { name: "nonce", type: "uint256" }
    ]
  }

  const salesOrder = {
    contractAddress: nftItem.contractAddress,
    tokenId: nftItem.tokenId,
    tokenOwner: tokenOwner,
    price: nftItem.price,
    tokenURI: nftItem.tokenURI,
    nonce: nonce
  }

  return { domain, types, salesOrder }
}
