// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ERC165, IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC721, IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {SalesOrderChecker} from "./SalesOrderChecker.sol";
import {IMarketplaceNFT} from "./IMarketplaceNFT.sol";

error PriceMustBeGreaterThanZero();
error ItemAlreadyExistsInTheMarketplace();
error ProvidedAddressDoesNotSupportERC721Interface();
error ItemIsNotListedInTheMarketplace();
error PaymentIsNotExact();
error NoPaymentsAvailableToWithdraw();
error SellerCannotBuyItsOwnItem();
error CallerIsNotOwner();
error OperatorNotApproved();
error UserDoesNotHaveMinterRole();
error BuyerAndSellerAreTheSame();

contract Marketplace is ReentrancyGuard, Ownable, SalesOrderChecker {
    struct Item {
        address seller;
        uint256 price;
    }

    bytes4 private constant INTERFACE_ID_ERC2981 = 0x2a55205a;
    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;

    uint256 public platformFee;

    mapping(address => mapping(uint256 => Item)) public itemByAddressAndId;

    mapping(address => uint256) private payments;

    event ItemAdded(address seller, address nftAddress, uint256 price, uint256 tokenId);

    event ItemRemoved(address nftAddress, uint256 tokenId);

    event ItemUpdated(address nftAddress, uint256 tokenId, uint256 price);

    event ItemBought(address seller, uint256 price, address buyer);

    event RoyaltyPaid();

    event Minted(address minter);

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

    constructor(uint256 _platformFee) {
        platformFee = _platformFee;
    }

    function redeem(SalesOrder calldata _salesOrder) public payable {
        address _seller = verify(_salesOrder);
        address _redeemer = msg.sender;

        _checkBuyerIsNotTheSeller(_seller);
        _checkPaymentIsExact(_salesOrder.price);

        IMarketplaceNFT nft = IMarketplaceNFT(_salesOrder.contractAddress);
        nft.mint(_seller, _salesOrder.tokenURI);

        IERC721(_salesOrder.contractAddress).safeTransferFrom(
            _seller,
            _redeemer,
            _salesOrder.tokenId
        );

        emit Minted(_seller);
    }

    function addItem(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _itemPrice
    ) external notAlreadyAdded(_nftAddress, _tokenId) {
        _checkPriceGreaterThanZero(_itemPrice);

        if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC721) == false) {
            revert ProvidedAddressDoesNotSupportERC721Interface();
        }

        IERC721 nft = IERC721(_nftAddress);
        if (nft.ownerOf(_tokenId) != _msgSender()) {
            revert CallerIsNotOwner();
        }
        if (!nft.isApprovedForAll(_msgSender(), address(this))) {
            revert OperatorNotApproved();
        }

        itemByAddressAndId[_nftAddress][_tokenId] = Item(msg.sender, _itemPrice);

        emit ItemAdded(msg.sender, _nftAddress, _itemPrice, _tokenId);
    }

    function removeItem(address _nftAddress, uint256 _tokenId)
        external
        itemListed(_nftAddress, _tokenId)
    {
        delete itemByAddressAndId[_nftAddress][_tokenId];

        emit ItemRemoved(_nftAddress, _tokenId);
    }

    function updateItem(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external itemListed(_nftAddress, _tokenId) {
        _checkPriceGreaterThanZero(_price);

        Item storage _item = itemByAddressAndId[_nftAddress][_tokenId];
        _item.price = _price;

        emit ItemUpdated(_nftAddress, _tokenId, _price);
    }

    function buyItem(address _nftAddress, uint256 _tokenId)
        external
        payable
        itemListed(_nftAddress, _tokenId)
        nonReentrant
    {
        Item memory _item = itemByAddressAndId[_nftAddress][_tokenId];

        _checkBuyerIsNotTheSeller(_item.seller);
        _checkPaymentIsExact(_item.price);

        uint256 _initialPayment = msg.value;
        uint256 _payment = msg.value;

        if (ERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC2981) != false) {
            (address receiver, uint256 royaltyAmount) = IERC2981(_nftAddress).royaltyInfo(
                _tokenId,
                _item.price
            );

            if (royaltyAmount > 0) {
                payments[receiver] += royaltyAmount;
                _payment -= royaltyAmount;

                emit RoyaltyPaid();
            }
        }

        uint256 _feePayment = (platformFee * _initialPayment) / 1e2;
        payments[owner()] = _feePayment;
        payments[_item.seller] += _payment - _feePayment;

        IERC721(_nftAddress).safeTransferFrom(_item.seller, _msgSender(), _tokenId);

        delete itemByAddressAndId[_nftAddress][_tokenId];

        emit ItemBought(_item.seller, _item.price, msg.sender);
    }

    function withdrawPayments() external nonReentrant {
        uint256 _payment = payments[msg.sender];

        if (_payment == 0) {
            revert NoPaymentsAvailableToWithdraw();
        }
        payments[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: _payment}("");
        require(success, "Transfer failed");
    }

    function _checkBuyerIsNotTheSeller(address _seller) private view {
        if (_msgSender() == _seller) {
            revert SellerCannotBuyItsOwnItem();
        }
    }

    function _checkPaymentIsExact(uint256 _price) private view {
        if (msg.value != _price) {
            revert PaymentIsNotExact();
        }
    }

    function _checkPriceGreaterThanZero(uint256 _itemPrice) private pure {
        if (_itemPrice == 0) {
            revert PriceMustBeGreaterThanZero();
        }
    }
}
