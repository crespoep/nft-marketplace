//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721Enumerable{
  uint256 private immutable MAX_NFTS;
  uint256 private nftAmount;

  constructor(string memory _name, string memory _symbol, uint256 maxNfts) ERC721(_name, _symbol) {
    MAX_NFTS = maxNfts;
  }

  function mint(address _user) public {
    require(totalSupply() < MAX_NFTS);
    _safeMint(_user, totalSupply());
  }

  function getMaxAmountOfNfts() public view returns(uint256){
    return MAX_NFTS;
  }
}
