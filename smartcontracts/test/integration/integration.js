const { expect } = require("chai");
const { ethers, deployments, getChainId } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Marketplace", async () => {
  const ONE_ETHER = ethers.utils.parseEther("1");

  const FIRST_ITEM_ID = BigNumber.from("1");
  const SECOND_ITEM_ID = BigNumber.from("2");

  let
    deployer,
    user1,
    user2,
    user3,
    Marketplace,
    marketplace,
    NFT,
    nft,
    SalesOrder,
    salesOrderContract
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    [deployer, user1, user2, user3] = await ethers.getSigners();

    Marketplace = await deployments.get("Marketplace");
    NFT = await deployments.get("MarketplaceNFT");
    SalesOrder = await deployments.get("SalesOrderChecker");

    marketplace = await ethers.getContractAt("Marketplace", Marketplace.address);
    nft = await ethers.getContractAt("MarketplaceNFT", NFT.address);
    salesOrderContract = await ethers.getContractAt("SalesOrderChecker", SalesOrder.address);
  })

  it('redeeming should mint a new item and transfers it correctly to the owner', async () => {
    const domain = {
      name: "LAZY_MARKETPLACE",
      version: "1",
      chainId: await getChainId(),
      verifyingContract: salesOrderContract.address
    }

    const types = {
      SalesOrder: [
        { name: "contractAddress", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "tokenOwner", type: "address" },
        { name: "price", type: "uint256" },
        { name: "tokenURI", type: "string" }
      ]
    }

    let salesOrder = {
      contractAddress: nft.address,
      tokenId: BigNumber.from(0),
      tokenOwner: user1.address,
      price: ONE_ETHER,
      tokenURI: "https://example.uri/ipfs/Qmef"
    }

    const signature = await user1._signTypedData(domain, types, salesOrder);
    salesOrder = {...salesOrder, signature};

    const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    await nft.grantRole(minterRole, user1.address);

    await nft.connect(user1).setApprovalForAll(marketplace.address, true);

    await marketplace.redeem(user2.address, salesOrder);

    const owner = await nft.ownerOf(0);
    expect(owner).to.equal(user2.address)
  });
})
