// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error PriceMustBeGreaterThanZero();
error ItemAlreadyExistsInTheMarketplace();
error ProvidedAddressDoesNotSupportERC721Interface();
error ItemIsNotListedInTheMarketplace();
error PaymentIsNotExact();

contract NFTMarketplace is ERC165 {
  struct Item {
    address seller;
    uint256 price;
  }

  event ItemAdded(
    address seller,
    address nftAddress,
    uint256 price,
    uint256 tokenId
  );

  event ItemRemoved(
    address nftAddress,
    uint256 tokenId
  );

  event ItemUpdated(
    address nftAddress,
    uint256 tokenId,
    uint256 price
  );

  mapping(address => mapping(uint256 => Item)) public itemByAddressAndId;

  modifier notAlreadyAdded(address _nftAddress, uint256 _tokenId) {
    Item memory nft = itemByAddressAndId[_nftAddress][_tokenId];
    if (nft.seller != address(0)) {
      revert ItemAlreadyExistsInTheMarketplace();
    }
    _;
  }

  modifier itemListed(address _nftAddress, uint256 _tokenId) {
    if (itemByAddressAndId[_nftAddress][_tokenId].price == 0) {
      revert ItemIsNotListedInTheMarketplace();
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

    itemByAddressAndId[_nftAddress][_tokenId] = Item(msg.sender, _itemPrice);

    emit ItemAdded(msg.sender, _nftAddress, _itemPrice, _tokenId);
  }

  function removeItem(address _nftAddress, uint256 _tokenId) external itemListed(_nftAddress, _tokenId) {
    delete itemByAddressAndId[_nftAddress][_tokenId];

    emit ItemRemoved(_nftAddress, _tokenId);
  }

  function updateItem(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _price
  ) external
    itemListed(_nftAddress, _tokenId)
  {
    _checkPriceGreaterThanZero(_price);

    Item storage _item = itemByAddressAndId[_nftAddress][_tokenId];
    _item.price = _price;

    emit ItemUpdated(_nftAddress, _tokenId, _price);
  }

  function buyItem(address _nftAddress, uint256 _tokenId) payable external itemListed(_nftAddress, _tokenId) {
    Item memory _item = itemByAddressAndId[_nftAddress][_tokenId];

    _checkPaymentIsExact(_item);
  }

  function _checkPaymentIsExact(Item memory _item) private view {
    if (msg.value != _item.price) {
      revert PaymentIsNotExact();
    }
  }

  function _checkPriceGreaterThanZero(uint256 _itemPrice) private pure {
    if (_itemPrice == 0) {
      revert PriceMustBeGreaterThanZero();
    }
  }
}
