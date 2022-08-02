const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");
const { BigNumber } = require("ethers");
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const IERC165 = require('../artifacts/contracts/NFT.sol/NFT.json');

describe("NFT marketplace", async () => {
  const ITEM_PRICE_EXAMPLE = ethers.utils.parseEther("1");
  const ITEM_ID_EXAMPLE = BigNumber.from("1")

  let
    deployer,
    user1,
    user2,
    Marketplace,
    marketplaceContract,
    itemMock
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    [deployer, user1, user2] = await ethers.getSigners();

    Marketplace = await deployments.get("NFTMarketplace");
    marketplaceContract = await ethers.getContractAt("NFTMarketplace", Marketplace.address)

    itemMock = await deployMockContract(deployer, IERC165.abi);

    await itemMock.mock.supportsInterface.returns(true);
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
        marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, 0)
      ).to.be.revertedWith("PriceMustBeGreaterThanZero()");
      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).not.to.be.revertedWith("PriceMustBeGreaterThanZero()");
    });

    it('should be reverted if nft contract address does not implement ERC721 interface', async () => {
      await itemMock.mock.supportsInterface.returns(false);

      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("ProvidedAddressDoesNotSupportERC721Interface()")
    });

    it('should be reverted if nft was already added in the marketplace', async () => {
      await marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE);
      await expect(
        marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("ItemAlreadyExistsInTheMarketplace()")
    });

    it('should add the new item to the listing successfully', async () => {
      await expect(marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).to.emit(marketplaceContract, "ItemAdded")
        .withArgs(user1.address, itemMock.address, ITEM_PRICE_EXAMPLE, ITEM_ID_EXAMPLE)

      const nft = await marketplaceContract.itemByAddressAndId(itemMock.address, 1)

      expect(nft.seller).to.equal(user1.address)
      expect(nft.price).to.equal(ITEM_PRICE_EXAMPLE)
    });
  })

  describe("removing an item", async () => {
    it('should fail if item does not exist', async () => {
      await expect(marketplaceContract.removeItem(
        itemMock.address,
        ITEM_ID_EXAMPLE
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should remove the item from listing', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.removeItem(
        itemMock.address,
        ITEM_ID_EXAMPLE
      )).to.emit(marketplaceContract, "ItemRemoved").withArgs(itemMock.address, ITEM_ID_EXAMPLE);

      const item = await marketplaceContract.itemByAddressAndId(itemMock.address, ITEM_ID_EXAMPLE)
      expect(item.price).to.equal(0)
    });
  })

  describe("updating an item", async () => {
    it('should fail if item does not exist', async () => {
      await expect(marketplaceContract.updateItem(
        itemMock.address,
        ITEM_ID_EXAMPLE,
        ITEM_PRICE_EXAMPLE
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should fail if new price is not greater than zero', async () => {
      await marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      const newPrice = 0;
      await expect(
        marketplaceContract.updateItem(itemMock.address, ITEM_ID_EXAMPLE, newPrice)
      ).to.be.revertedWith("PriceMustBeGreaterThanZero()");
    });

    it('should change item price correctly', async () => {
      await marketplaceContract.connect(user1).addItem(itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      const newPrice = ITEM_PRICE_EXAMPLE.mul(2);

      await expect(
        marketplaceContract.updateItem(itemMock.address, ITEM_ID_EXAMPLE, newPrice)
      ).to
        .emit(marketplaceContract, "ItemUpdated")
        .withArgs(
          itemMock.address,
          ITEM_ID_EXAMPLE,
          newPrice
        );

      const item = await marketplaceContract.itemByAddressAndId(itemMock.address, ITEM_ID_EXAMPLE)
      expect(item.price).to.equal(newPrice)
    });
  })

  describe("buy an item", async () => {
    it('should fail if items does not exist', async () => {
      await expect(marketplaceContract.connect(user1).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ITEM_PRICE_EXAMPLE }
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should fail if buyer is the same as seller', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )
      await expect(marketplaceContract.connect(user1).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ethers.utils.parseEther("1") }
      )).to.be.revertedWith("SellerCannotBuyItsOwnItem()")
    });

    it('should fail if payment is not exactly equal to item price', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ethers.utils.parseEther("0.9") }
      )).to.be.revertedWith("PaymentIsNotExact()")

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ethers.utils.parseEther("1.1") }
      )).to.be.revertedWith("PaymentIsNotExact()")
    });

    it.skip('should transfer ownership to buyer', async () => {});

    it('should remove item from the listing after operation is done', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ITEM_PRICE_EXAMPLE }
      ))

      const item = await marketplaceContract.itemByAddressAndId(itemMock.address, ITEM_ID_EXAMPLE);

      expect(item.seller).to.equal(ethers.constants.AddressZero)
      expect(item.price).to.equal(BigNumber.from("0"))
    });

    it('should emit the ItemBought event', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ITEM_PRICE_EXAMPLE }
      )).to.emit(marketplaceContract, "ItemBought")
        .withArgs(user1.address, ITEM_PRICE_EXAMPLE, user2.address)
    });
  })

  describe("withdrawal", async () => {
    const platformFee = await marketplaceContract.platformFee();
    const platformPayment = platformFee.mul(ITEM_PRICE_EXAMPLE).div(1e2);
    const sellerPayment = ITEM_PRICE_EXAMPLE.sub(platformPayment);

    it('should be done successfully', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ITEM_PRICE_EXAMPLE }
      ))

      await expect(
        await marketplaceContract.connect(user1).withdrawPayments()
      ).to.changeEtherBalance(user1, sellerPayment);
    });

    it("should send platform fee to the owner", async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ITEM_PRICE_EXAMPLE }
      ))

      expect(
        await marketplaceContract.withdrawPayments()
      ).to.changeEtherBalance(deployer, expectedPayment);
    });

    it('should fail if trying to withdraw twice in a row', async () => {
      await marketplaceContract.connect(user1).addItem(
        itemMock.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.connect(user2).buyItem(
        itemMock.address,
        ITEM_ID_EXAMPLE, { value: ITEM_PRICE_EXAMPLE }
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
})
