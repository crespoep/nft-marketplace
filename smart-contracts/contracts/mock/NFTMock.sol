//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Returns true if `account` is a contract.
 *
 * Although this mocked contract seems unnecessary, it's a workaround for a bug that occurs while
 * mocking the function safeTransferFrom in the MarketplaceNFT contract. Because the contract inherits ERC721
 * from both ERC721Storage and ERC721Enumerable, the typical "Mock on the method is not initialized" error raises.
 * If only inheriting from one of those contracts, the error disappears.
 */
contract NFTMock {
    function supportsInterface(bytes4 interfaceId) public view returns (bool) {
        return false;
    }

    function mint(address _user, string memory tokenURI) public {}

    function safeTransferFrom(
        address seller,
        address buyer,
        uint256 _tokenId
    ) public view {}

    function ownerOf(uint256 _tokenId) public view returns (address) {
        return address(0);
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return false;
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        return (address(0), 0);
    }
}
