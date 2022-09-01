import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { deployMockContract, MockContract } from "@ethereum-waffle/mock-contract";
import { Contract } from "ethers";

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");


const ItemMock = require('../artifacts/contracts/mock/NFTMock.sol/NFTMock.json');
const SalesOrderCheckerMock = require('../artifacts/contracts/SalesOrderChecker.sol/SalesOrderChecker.json');

describe.only("Marketplace", async () => {
  const ITEM_PRICE_EXAMPLE = ethers.utils.parseEther("1");

  const IERC2981_ID = "0x2a55205a";
  const IERC721_ID = "0x80ac58cd";

  const FIRST_ITEM_ID = BigNumber.from("1");
  const SECOND_ITEM_ID = BigNumber.from("2");

  let
    deployer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    user3: SignerWithAddress,
    Marketplace,
    marketplaceContract: Contract,
    itemMock: MockContract,
    salesOrderCheckerMock: MockContract
  ;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    itemMock = await deployMockContract(deployer, ItemMock.abi);
    salesOrderCheckerMock = await deployMockContract(deployer, SalesOrderCheckerMock.abi);

    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplaceContract = await Marketplace.deploy(
      BigNumber.from(3),
      salesOrderCheckerMock.address
    );

    await itemMock.mock.supportsInterface.withArgs(IERC721_ID).returns(true);
    await itemMock.mock.ownerOf.returns(user1.address);
    await itemMock.mock.isApprovedForAll.returns(true);
  })

  describe('redeem', async () => {
    let salesOrder: any;

    beforeEach(async () => {
      salesOrder = {
        contractAddress: itemMock.address,
        tokenId: 1,
        tokenOwner: user1.address,
        price: ethers.utils.parseEther("1"),
        tokenURI: "https://example.uri/ipfs/Qmef",
        nonce: 1,
        // This is an example signature made with signer._signTypedData method
        signature: "0x484780e03f598b91214366ff195095643a939be58f9cf2adcba21b135b1c"
      }
    })

    it('should fail if signer does not have minter role', async () => {
      await salesOrderCheckerMock.mock.verify.returns(user1.address);
      await itemMock.mock.mint.reverts();
      await itemMock.mock.safeTransferFrom.returns();

      await expect(
        marketplaceContract.redeem(user2.address, salesOrder)
      ).to.be.reverted
    });

    it('should mint a new item to the signer account', async () => {
      await salesOrderCheckerMock.mock.verify.returns(user1.address);
      await itemMock.mock.mint.returns();
      await itemMock.mock.safeTransferFrom.returns();

      await expect(
        marketplaceContract.redeem(user2.address, salesOrder)
      ).to.emit(marketplaceContract, "Minted").withArgs(user1.address)
    });

    // It would be better to have a method like toHaveBeenCalled in safeTransferFrom to check the transfer
    it.skip('should transfer the new minted item to the buyer', async () => {
      await salesOrderCheckerMock.mock.verify.returns(user1.address);
      await itemMock.mock.mint.returns()
      await itemMock.mock.safeTransferFrom.returns()

      await marketplaceContract.redeem(user2.address, salesOrder)
    });
  })

  describe("deployment", async () => {
    it('should be done successfully', async () => {
      const address = marketplaceContract.address;

      expect(address).not.to.equal(null);
      expect(address).not.to.equal(0x0);
      expect(address).not.to.equal("");
      expect(address).not.to.equal(undefined);
    });

    it('should set the platform fee correctly', async () => {
      expect(await marketplaceContract.platformFee()).to.equal(BigNumber.from("3"))
    });
  })

  describe("adding an item", async () => {
    it('should be reverted if item price is not greater than zero', async () => {
      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, 0)
      ).to.be.revertedWith("PriceMustBeGreaterThanZero()");
      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).not.to.be.revertedWith("PriceMustBeGreaterThanZero()");
    });

    it('should be reverted if nft contract address does not implement ERC721 interface', async () => {
      await itemMock.mock.supportsInterface.withArgs(IERC721_ID).returns(false);

      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("ProvidedAddressDoesNotSupportERC721Interface()")
    });

    it('should be reverted if nft was already added in the marketplace', async () => {
      await marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);
      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("ItemAlreadyExistsInTheMarketplace()")
    });

    it('should fail if caller is not the owner of the item', async () => {
      await itemMock.mock.ownerOf.returns(user2.address)

      await expect(marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("CallerIsNotOwner()")
    });

    it('should fail if marketplace is not approved to manage the item', async () => {
      await itemMock.mock.isApprovedForAll.returns(false)

      await expect(marketplaceContract.connect(user1).addItem(itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("OperatorNotApproved()")
    });

    it('should add the new item to the listing successfully', async () => {
      await expect(marketplaceContract.connect(user1).addItem(
        itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.emit(marketplaceContract, "ItemAdded")
        .withArgs(user1.address, itemMock.address, ITEM_PRICE_EXAMPLE, FIRST_ITEM_ID)

      const nft = await marketplaceContract.itemByAddressAndId(itemMock.address, 1)

      expect(nft.seller).to.equal(user1.address)
      expect(nft.price).to.equal(ITEM_PRICE_EXAMPLE)
    });
  })

  describe("removing an item", async () => {
    beforeEach(async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE
      )
    })

    it('should fail if item does not exist', async () => {
      await expect(marketplaceContract.removeItem(
        itemMock.address,
        SECOND_ITEM_ID
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should remove the item from listing', async () => {
      await expect(marketplaceContract.removeItem(
        itemMock.address,
        FIRST_ITEM_ID
      )).to.emit(marketplaceContract, "ItemRemoved").withArgs(itemMock.address, FIRST_ITEM_ID);

      const item = await marketplaceContract.itemByAddressAndId(itemMock.address, FIRST_ITEM_ID)
      expect(item.price).to.equal(0)
    });
  })

  describe("updating an item", async () => {
    beforeEach(async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE
      )
    })

    it('should fail if item does not exist', async () => {
      await expect(marketplaceContract.updateItem(
        itemMock.address,
        SECOND_ITEM_ID,
        ITEM_PRICE_EXAMPLE
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should fail if new price is not greater than zero', async () => {
      const newPrice = 0;
      await expect(
        marketplaceContract.updateItem(itemMock.address, FIRST_ITEM_ID, newPrice)
      ).to.be.revertedWith("PriceMustBeGreaterThanZero()");
    });

    it('should change item price correctly', async () => {
      const newPrice = ITEM_PRICE_EXAMPLE.mul(2);

      await expect(
        marketplaceContract.updateItem(itemMock.address, FIRST_ITEM_ID, newPrice)
      ).to
        .emit(marketplaceContract, "ItemUpdated")
        .withArgs(
          itemMock.address,
          FIRST_ITEM_ID,
          newPrice
        );

      const item = await marketplaceContract.itemByAddressAndId(itemMock.address, FIRST_ITEM_ID)
      expect(item.price).to.equal(newPrice)
    });
  })

  describe("buy an item", async () => {
    beforeEach(async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE
      )

      await itemMock.mock.safeTransferFrom.returns();
    })

    it('should fail if items does not exist', async () => {
      await expect(marketplaceContract.connect(user1).buyItem(
        itemMock.address,
        SECOND_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should fail if buyer is the same as seller', async () => {
      await expect(marketplaceContract.connect(user1).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ethers.utils.parseEther("1") }
      )).to.be.revertedWith("SellerCannotBuyItsOwnItem()")
    });

    it('should fail if payment is not exactly equal to item price', async () => {
      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ethers.utils.parseEther("0.9") }
      )).to.be.revertedWith("PaymentIsNotExact()")

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ethers.utils.parseEther("1.1") }
      )).to.be.revertedWith("PaymentIsNotExact()")
    });

    it('should remove item from the listing after operation is done', async () => {
      await itemMock.mock.supportsInterface.withArgs(IERC2981_ID).returns(false);
      await itemMock.mock.safeTransferFrom.returns();

      expect(await marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      ))

      const item = await marketplaceContract.itemByAddressAndId(itemMock.address, FIRST_ITEM_ID);

      expect(item.seller).to.equal(ethers.constants.AddressZero)
      expect(item.price).to.equal(BigNumber.from("0"))
    });

    it('should emit the ItemBought event', async () => {
      await itemMock.mock.supportsInterface.withArgs(IERC2981_ID).returns(false);
      await itemMock.mock.safeTransferFrom.returns();

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      )).to.emit(marketplaceContract, "ItemBought")
        .withArgs(user1.address, ITEM_PRICE_EXAMPLE, user2.address)
    });

  })

  describe("withdrawal", async () => {
    const platformFee = await marketplaceContract.platformFee();
    const platformPayment = platformFee.mul(ITEM_PRICE_EXAMPLE).div(1e2);
    const sellerPayment = ITEM_PRICE_EXAMPLE.sub(platformPayment);

    beforeEach(async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE
      )
    })

    it('should be done successfully', async () => {
      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      ))

      await expect(
        await marketplaceContract.connect(user1).withdrawPayments()
      ).to.changeEtherBalance(user1, sellerPayment);
    });

    it("should send platform fee to the owner", async () => {
      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      ))

      await expect(
        await marketplaceContract.withdrawPayments()
      ).to.changeEtherBalance(deployer, ITEM_PRICE_EXAMPLE);
    });

    it('should fail if trying to withdraw twice in a row', async () => {
      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      ))

      await expect(
        await marketplaceContract.connect(user1).withdrawPayments()
      ).to.changeEtherBalance(user1, sellerPayment);

      await expect(
        marketplaceContract.connect(user1).withdrawPayments()
      ).to.be.revertedWith("NoPaymentsAvailableToWithdraw()")
    });

    it('should fail if there is no payment available to withdraw', async () => {
      await expect(
        marketplaceContract.connect(user1).withdrawPayments()
      ).to.be.revertedWith("NoPaymentsAvailableToWithdraw()")
    });
  })

  describe("royalties payment", async () => {
    beforeEach(async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE
      )
    })

    it('should not be done if item does not implement IERC2981', async () => {
      await itemMock.mock.supportsInterface.withArgs(IERC2981_ID).returns(false);
      await itemMock.mock.safeTransferFrom.returns();

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      )).not.to.emit(marketplaceContract, "RoyaltyPaid");
    });

    it('should be done if item implements IERC2189', async () => {
      await itemMock.mock.supportsInterface.withArgs(IERC2981_ID).returns(true);
      await itemMock.mock.safeTransferFrom.returns();
      // user3 will be the considered the token author
      await itemMock.mock.royaltyInfo.returns(user3.address, ethers.utils.parseEther("0.15"))

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      )).to.emit(marketplaceContract, "RoyaltyPaid");

      await expect(
        await marketplaceContract.connect(user3).withdrawPayments()
      ).to.changeEtherBalance(user3, ethers.utils.parseEther("0.15"));
    });

    it('should not be done if royalties amount is zero', async () => {
      await itemMock.mock.supportsInterface.withArgs(IERC2981_ID).returns(false);
      await itemMock.mock.safeTransferFrom.returns();
      // user3 will be the considered the token author
      await itemMock.mock.royaltyInfo.returns(user3.address, ethers.utils.parseEther("0"))

      await expect(await marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        FIRST_ITEM_ID, { value: ITEM_PRICE_EXAMPLE }
      )).not.to.emit(marketplaceContract, "RoyaltyPaid");

      await expect(
        await marketplaceContract.withdrawPayments()
      ).to.changeEtherBalance(user3, ethers.utils.parseEther("0"));
    });
  })
})
