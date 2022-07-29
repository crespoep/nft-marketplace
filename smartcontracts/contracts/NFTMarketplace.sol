// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error PriceMustBeGreaterThanZero();
error NFTAlreadyExistsInTheMarketplace();
error ProvidedAddressDoesNotSupportERC721Interface();
error NFTIsNotListedInTheMarketplace();

contract NFTMarketplace is ERC165 {
  struct NFT {
    address seller;
    uint256 price;
  }

  event NFTAdded(
    address seller,
    address nftAddress,
    uint256 price,
    uint256 tokenId
  );

  event NFTRemoved(

  );

  mapping(address => mapping(uint256 => NFT)) public nftByAddressAndId;

  modifier notAlreadyAdded(address _nftAddress, uint256 _tokenId) {
    NFT memory nft = nftByAddressAndId[_nftAddress][_tokenId];
    if (nft.seller != address(0)) {
      revert NFTAlreadyExistsInTheMarketplace();
    }
    _;
  }

  function addItem(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _itemPrice
  )
    external
    notAlreadyAdded(_nftAddress, _tokenId)
  {
    _checkPriceGreaterThanZero(_itemPrice);

    if (ERC165(_nftAddress).supportsInterface(type(IERC721).interfaceId) == false) {
      revert ProvidedAddressDoesNotSupportERC721Interface();
    }

    nftByAddressAndId[_nftAddress][_tokenId] = NFT(msg.sender, _itemPrice);

    emit NFTAdded(msg.sender, _nftAddress, _itemPrice, _tokenId);
  }

  function removeItem(address _nftAddress, uint256 _tokenId) external {
    if (nftByAddressAndId[_nftAddress][_tokenId].price == 0) {
      revert NFTIsNotListedInTheMarketplace();
    }
    emit NFTRemoved();
  }

  function _checkPriceGreaterThanZero(uint256 _itemPrice) private pure {
    if (_itemPrice == 0) {
      revert PriceMustBeGreaterThanZero();
    }
  }
}
