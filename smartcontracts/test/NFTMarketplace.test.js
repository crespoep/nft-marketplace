const { expect } = require("chai")
const { ethers, deployments } = require("hardhat")

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
})
