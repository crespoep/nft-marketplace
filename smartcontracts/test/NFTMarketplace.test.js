const { expect } = require("chai")
const { ethers, deployments } = require("hardhat")
const {BigNumber} = require("ethers");

describe("NFT marketplace", async () => {
  let
    Marketplace,
    marketplaceContract
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    Marketplace = await deployments.get("NFTMarketplace");
    marketplaceContract = await ethers.getContractAt("NFTMarketplace", Marketplace.address)
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
      await expect(marketplaceContract.addItem(0)).to.be.reverted
      await expect(marketplaceContract.addItem(BigNumber.from("1"))).not.to.be.reverted;
    });
  })

})
