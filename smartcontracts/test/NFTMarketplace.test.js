const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");
const { BigNumber } = require("ethers");
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const IERC165 = require('../artifacts/contracts/NFT.sol/NFT.json');

describe("NFT marketplace", async () => {
  const ITEM_PRICE_EXAMPLE = BigNumber.from("1")
  const ITEM_ID_EXAMPLE = BigNumber.from("1")

  let
    deployer,
    Marketplace,
    marketplaceContract,
    mockERC165
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    [deployer] = await ethers.getSigners();

    Marketplace = await deployments.get("NFTMarketplace");
    marketplaceContract = await ethers.getContractAt("NFTMarketplace", Marketplace.address)

    mockERC165 = await deployMockContract(deployer, IERC165.abi);
  })

  it('should be deployed successfully', async () => {
    const address = marketplaceContract.address;

    expect(address).not.to.equal(null);
    expect(address).not.to.equal(0x0);
    expect(address).not.to.equal("");
    expect(address).not.to.equal(undefined);
  });

  describe("adding an item", async () => {
    it('should be reverted if item price is not greater than zero', async () => {
      await expect(
        marketplaceContract.addItem(mockERC165.address, ITEM_ID_EXAMPLE, 0)
      ).to.be.revertedWith("PriceMustBeGreaterThanZero()");
      await expect(
        marketplaceContract.addItem(mockERC165.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).not.to.be.revertedWith("PriceMustBeGreaterThanZero()");
    });

    it('should be reverted if nft contract address does not implement ERC721 interface', async () => {
      await mockERC165.mock.supportsInterface.returns(false);
      await expect(
        marketplaceContract.addItem(mockERC165.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("ProvidedAddressDoesNotSupportERC721Interface()")
    });

    it('should be reverted if nft was already added in the marketplace', async () => {
      await mockERC165.mock.supportsInterface.returns(true);
      await marketplaceContract.addItem(mockERC165.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE);
      await expect(
        marketplaceContract.addItem(mockERC165.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWith("ItemAlreadyExistsInTheMarketplace()")
    });

    it('should be add the new item to the listing successfully', async () => {
      await mockERC165.mock.supportsInterface.returns(true);
      await expect(marketplaceContract.addItem(
        mockERC165.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE)
      ).to.emit(marketplaceContract, "ItemAdded")
        .withArgs(deployer.address, mockERC165.address, ITEM_PRICE_EXAMPLE, ITEM_ID_EXAMPLE)

      const nft = await marketplaceContract.itemByAddressAndId(mockERC165.address, 1)

      expect(nft.seller).to.equal(deployer.address)
      expect(nft.price.toNumber()).to.equal(1)
    });
  })

  describe("removing an NFT", async () => {
    it('should fail if NFT does not exist', async () => {
      await mockERC165.mock.supportsInterface.returns(true);
      await expect(marketplaceContract.removeItem(
        mockERC165.address,
        ITEM_ID_EXAMPLE
      )).to.be.revertedWith("ItemIsNotListedInTheMarketplace()")
    });

    it('should remove the item from listing', async () => {
      await mockERC165.mock.supportsInterface.returns(true);

      await marketplaceContract.addItem(
        mockERC165.address, ITEM_ID_EXAMPLE, ITEM_PRICE_EXAMPLE
      )

      await expect(marketplaceContract.removeItem(
        mockERC165.address,
        ITEM_ID_EXAMPLE
      )).to.emit(marketplaceContract, "ItemRemoved").withArgs(mockERC165.address, ITEM_ID_EXAMPLE);

      const item = await marketplaceContract.itemByAddressAndId(mockERC165.address, ITEM_ID_EXAMPLE)
      expect(item.price).to.equal(0)
    });
  })
})
