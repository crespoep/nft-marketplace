import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Marketplace, MarketplaceNFT, SalesOrderChecker } from '../../typechain-types'
import { BigNumber } from "ethers";
import { expect } from "chai";
import { ethers, deployments, getChainId } from "hardhat";

describe.skip("Marketplace", async () => {
  const ONE_ETHER = ethers.utils.parseEther("1");
  const FIRST_ITEM_ID = BigNumber.from("0");

  let
    deployer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    user3: SignerWithAddress,
    Marketplace,
    NFT,
    SalesOrder,
    marketplace: Marketplace,
    nft: MarketplaceNFT,
    salesOrderContract: SalesOrderChecker
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
      tokenId: FIRST_ITEM_ID,
      tokenOwner: user1.address,
      price: ONE_ETHER,
      tokenURI: "https://example.uri/ipfs/Qmef",
      signature: ""
    }

    const signature = await user1._signTypedData(domain, types, salesOrder);
    salesOrder = {...salesOrder, signature};

    const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    await nft.grantRole(minterRole, user1.address);

    await nft.connect(user1).setApprovalForAll(marketplace.address, true);

    await marketplace.redeem(user2.address, salesOrder);

    const owner = await nft.ownerOf(FIRST_ITEM_ID);
    expect(owner).to.equal(user2.address)
  });
})
