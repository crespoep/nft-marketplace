// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Marketplace.sol";

contract SalesOrderChecker is EIP712 {
  constructor() EIP712("", "") {}

  function verify(Marketplace.SalesOrder memory _salesOrder) external pure returns(address) {
    return address(0);
  }
}
