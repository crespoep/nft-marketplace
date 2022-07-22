const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");
const { BigNumber } = require("ethers");
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const IERC165 = require('../artifacts/contracts/NFT.sol/NFT.json');

describe("NFT marketplace", async () => {
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
        marketplaceContract.addItem(mockERC165.address, 0)
      ).to.be.revertedWith("PriceMustBeGreaterThanZero()");
      await expect(
        marketplaceContract.addItem(mockERC165.address, BigNumber.from("1"))
      ).not.to.be.revertedWith("PriceMustBeGreaterThanZero()");
    });

    it('should be reverted if nft contract address does not implement ERC721 interface', async () => {
      await mockERC165.mock.supportsInterface.returns(false);
      await expect(
        marketplaceContract.addItem(mockERC165.address, BigNumber.from("1"))
      ).to.be.revertedWith("ProvidedAddressDoesNotSupportERC721Interface()")
    });
  })
})
