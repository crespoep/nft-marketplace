pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error PriceMustBeGreaterThanZero();
error ProvidedAddressDoesNotSupportERC721Interface();

contract NFTMarketplace is ERC165 {
  function addItem(address _nftAddress, uint256 _itemPrice) external {
    if (_itemPrice == 0) {
      revert PriceMustBeGreaterThanZero();
    }

    if (ERC165(_nftAddress).supportsInterface(type(IERC721).interfaceId) == false) {
      revert ProvidedAddressDoesNotSupportERC721Interface();
    }
  }
}
