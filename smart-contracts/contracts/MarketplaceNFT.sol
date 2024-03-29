//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IMarketplaceNFT} from "./IMarketplaceNFT.sol";
import "hardhat/console.sol";

error CallerDoesNotHaveMintingRole();

contract MarketplaceNFT is IMarketplaceNFT, ERC721Enumerable, ERC721URIStorage, AccessControl {
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private immutable MAX_NFTS;
    uint256 private nftAmount;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 maxNfts,
        address _marketplace
    ) ERC721(_name, _symbol) {
        MAX_NFTS = maxNfts;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, _marketplace);
    }

    function mint(address _user, string memory _tokenURI) public {
        require(totalSupply() < MAX_NFTS);
        if (!hasRole(MINTER_ROLE, msg.sender)) {
            revert CallerDoesNotHaveMintingRole();
        }

        uint256 _newTokenId = totalSupply();
        _safeMint(_user, _newTokenId);
        _setTokenURI(_newTokenId, _tokenURI);
    }

    function safeTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external {
        super.safeTransferFrom(from, to, tokenId);
    }

    function getMaxAmountOfNfts() public view returns (uint256) {
        return MAX_NFTS;
    }

    // The following functions are overrides required by Solidity

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
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
