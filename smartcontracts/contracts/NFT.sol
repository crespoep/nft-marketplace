//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract NFT {
  function supportsInterface(bytes4 interfaceId) public view returns (bool) {
    return false;
  }

  function safeTransferFrom(address seller, address buyer, uint256 _tokenId) public view {
  }
}
