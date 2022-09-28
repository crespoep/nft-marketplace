// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Marketplace.sol";
import "hardhat/console.sol";

contract SalesOrderChecker is EIP712 {
  bytes32 constant SALES_ORDER_TYPEHASH = keccak256(
    "SalesOrder(address contractAddress,uint256 tokenId,address tokenOwner,uint256 price,string tokenURI)"
  );

  constructor() EIP712("LAZY_MARKETPLACE", "1") {}

  function verify(Marketplace.SalesOrder calldata _salesOrder) internal view returns(address) {
    bytes32 digest = _hash(_salesOrder);
    return ECDSA.recover(digest, _salesOrder.signature);
  }

  function _hash(Marketplace.SalesOrder calldata _salesOrder) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      SALES_ORDER_TYPEHASH,
      _salesOrder.contractAddress,
      _salesOrder.tokenId,
      _salesOrder.tokenOwner,
      _salesOrder.price,
      keccak256(bytes(_salesOrder.tokenURI))
    )));
  }
}
