// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {EIP712, ECDSA} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract SalesOrderChecker is EIP712 {
  struct SalesOrder {
    address contractAddress;
    uint256 tokenId;
    address tokenOwner;
    uint256 price;
    string tokenURI;
    bytes signature;
  }

  bytes32 constant SALES_ORDER_TYPEHASH = keccak256(
    "SalesOrder(address contractAddress,uint256 tokenId,address tokenOwner,uint256 price,string tokenURI)"
  );

  constructor() EIP712("LAZY_MARKETPLACE", "1") {}

  function verify(SalesOrder calldata _salesOrder) internal view returns(address) {
    bytes32 digest = _hash(_salesOrder);
    return ECDSA.recover(digest, _salesOrder.signature);
  }

  function _hash(SalesOrder calldata _salesOrder) internal view returns (bytes32) {
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
