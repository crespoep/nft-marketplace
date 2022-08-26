const { expect } = require("chai");
const {ethers, deployments} = require("hardhat");
const deploy = deployments.deploy;

describe("NFT", async () => {
  let
    deployer,
    user1,
    NFT,
    nftContract
  ;

  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();

    NFT = await ethers.getContractFactory("NFT");
    nftContract = await NFT.deploy(
      "MyNFTs",
      "MNFT",
      2
    );
    await nftContract.deployed()
  })

  describe("deployment", async () => {
    it('should be done successfully', async () => {
      const address = nftContract.address;

      expect(address).not.to.equal(null);
      expect(address).not.to.equal(0x0);
      expect(address).not.to.equal("");
      expect(address).not.to.equal(undefined);
    });

    it('should set the name and symbol correctly', async () => {
      expect(await nftContract.name()).to.equal("MyNFTs");
      expect(await nftContract.symbol()).to.equal("MNFT");
    });

    it('should set the max amount of nfts correctly', async () => {
      expect(await nftContract.getMaxAmountOfNfts()).to.equal(2)
    });

    it('should set admin role for the deployer', async () => {
      expect(
        await nftContract.hasRole(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          deployer.address
        )
      ).to.be.true;
    });
  })

  describe('minting', async () => {
    let tokenURI;

    beforeEach(() => {
      tokenURI = 'my_nft';
    })

    it('should fail if max amount of nfts has been reached', async () => {
      const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

      await nftContract.grantRole(minterRole, user1.address);

      await expect(nftContract.mint(user1.address, tokenURI)).not.to.be.reverted;
      await expect(nftContract.mint(user1.address, tokenURI)).not.to.be.reverted;
      await expect(nftContract.mint(user1.address, tokenURI)).to.be.reverted;
    });

    it('should fail if user does not have minter role', async () => {
      await expect(nftContract.mint(user1.address, tokenURI)).to.be.reverted;
    });

    it('should set the tokenURI correctly', async () => {
      const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

      await nftContract.grantRole(minterRole, user1.address);

      await nftContract.mint(user1.address, tokenURI)
      const tokenId = 0;

      expect(await nftContract.tokenURI(tokenId)).to.equal(tokenURI)
    });
  })
})
