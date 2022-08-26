// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMarketplaceNFT {
  function mint(address _user, string memory _tokenURI) external;

  function safeTransfer(address from, address to, uint256 tokenId) external;
}
