pragma solidity ^0.8.7;

error PriceMustBeGreaterThanZero();

contract NFTMarketplace {
  function addItem(uint256 _itemPrice) external {
    if (_itemPrice == 0) {
      revert PriceMustBeGreaterThanZero();
    }
  }
}
