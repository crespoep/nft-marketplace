const { expect } = require("chai");
const {ethers, deployments} = require("hardhat");

describe.only("NFT", async () => {
  let
    deployer,
    NFT,
    nftContract
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    [deployer] = await ethers.getSigners();

    NFT = await deployments.get("NFT");
    nftContract = await ethers.getContractAt("NFT", NFT.address);
  })

  describe("deployment", async () => {
    it('should be done successfully', async () => {
      const address = nftContract.address;

      expect(address).not.to.equal(null);
      expect(address).not.to.equal(0x0);
      expect(address).not.to.equal("");
      expect(address).not.to.equal(undefined);
    });
  })
})
