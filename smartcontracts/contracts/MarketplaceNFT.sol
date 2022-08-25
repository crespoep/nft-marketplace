//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./IMarketplaceNFT.sol";

contract NFT is IMarketplaceNFT, ERC721Enumerable, ERC721URIStorage{
  uint256 private immutable MAX_NFTS;
  uint256 private nftAmount;

  constructor(string memory _name, string memory _symbol, uint256 maxNfts) ERC721(_name, _symbol) {
    MAX_NFTS = maxNfts;
  }

  function mint(address _user, string memory _tokenURI) public {
    require(totalSupply() < MAX_NFTS);

    uint256 _newTokenId = totalSupply();
    _safeMint(_user, _newTokenId);
    _setTokenURI(_newTokenId, _tokenURI);
  }

  function getMaxAmountOfNfts() public view returns(uint256){
    return MAX_NFTS;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
  internal
  override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
  public
  view
  override(ERC721, ERC721URIStorage)
  returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
  public
  view
  override(ERC721, ERC721Enumerable)
  returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
