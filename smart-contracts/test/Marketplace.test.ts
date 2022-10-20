import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// @ts-ignore
import { Marketplace } from "../typechain-types";
import {
  deployMockContract,
  MockContract,
} from "@ethereum-waffle/mock-contract";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { ethers, getChainId } from "hardhat";
import { createSalesOrder } from "./helpers/EIP712";
const NFTMockArtifact = require("../artifacts/contracts/mock/NFTMock.sol/NFTMock.json");

describe("Marketplace", async () => {
  const ITEM_PRICE_EXAMPLE = ethers.utils.parseEther("1");

  const IERC2981_ID = "0x2a55205a";
  const IERC721_ID = "0x80ac58cd";

  const FIRST_ITEM_ID = BigNumber.from("1");
  const SECOND_ITEM_ID = BigNumber.from("2");

  let deployer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    user3: SignerWithAddress,
    Marketplace,
    marketplaceContract: Marketplace,
    NFTMockContract: MockContract,
    calculatePlatformFee: Function,
    chainId: string;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    NFTMockContract = await deployMockContract(deployer, NFTMockArtifact.abi);

    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplaceContract = await Marketplace.deploy(BigNumber.from(3));

    await NFTMockContract.mock.supportsInterface
      .withArgs(IERC721_ID)
      .returns(true);
    await NFTMockContract.mock.ownerOf.returns(user1.address);
    await NFTMockContract.mock.isApprovedForAll.returns(true);

    calculatePlatformFee = async () => {
      const platformFee = await marketplaceContract.platformFee();
      return platformFee.mul(ITEM_PRICE_EXAMPLE).div(1e2);
    };

    chainId = await getChainId();
  });

  describe("deployment", async () => {
    it("should be done successfully", async () => {
      const address = marketplaceContract.address;

      expect(address).not.to.equal(null);
      expect(address).not.to.equal(0x0);
      expect(address).not.to.equal("");
      expect(address).not.to.equal(undefined);
    });

    it("should set the platform fee correctly", async () => {
      expect(await marketplaceContract.platformFee()).to.equal(
        BigNumber.from("3")
      );
    });
  });

  describe("adding an item", async () => {
    it("should be reverted if price is not greater than zero", async () => {
      const invalidPrice = 0;
      await expect(
        marketplaceContract
          .connect(user1)
          .addItem(NFTMockContract.address, FIRST_ITEM_ID, invalidPrice)
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "PriceMustBeGreaterThanZero"
      );
    });

    it("should be reverted if nfts contract address does not implement ERC721 interface", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC721_ID)
        .returns(false);

      await expect(
        marketplaceContract
          .connect(user1)
          .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "ProvidedAddressDoesNotSupportERC721Interface"
      );
    });

    it("should be reverted if nfts was already added in the marketplace", async () => {
      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);
      await expect(
        marketplaceContract
          .connect(user1)
          .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "ItemAlreadyExistsInTheMarketplace"
      );
    });

    it("should be reverted if caller is not the owner of the item", async () => {
      await NFTMockContract.mock.ownerOf.returns(user2.address);

      await expect(
        marketplaceContract
          .connect(user1)
          .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWithCustomError(marketplaceContract, "CallerIsNotOwner");
    });

    it("should be reverted if marketplace is not approved to manage the item", async () => {
      await NFTMockContract.mock.isApprovedForAll.returns(false);

      await expect(
        marketplaceContract
          .connect(user1)
          .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "OperatorNotApproved"
      );
    });

    it("should add the new item to the listing successfully", async () => {
      await expect(
        marketplaceContract
          .connect(user1)
          .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE)
      )
        .to.emit(marketplaceContract, "ItemAdded")
        .withArgs(
          FIRST_ITEM_ID,
          NFTMockContract.address,
          user1.address,
          ITEM_PRICE_EXAMPLE
        );

      const nft = await marketplaceContract.itemByAddressAndId(
        NFTMockContract.address,
        FIRST_ITEM_ID
      );

      expect(nft.seller).to.equal(user1.address);
      expect(nft.price).to.equal(ITEM_PRICE_EXAMPLE);
    });
  });

  describe("removing an item", async () => {
    beforeEach(async () => {
      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);
    });

    it("should be reverted if item does not exist", async () => {
      await expect(
        marketplaceContract.removeItem(NFTMockContract.address, SECOND_ITEM_ID)
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "ItemIsNotListedInTheMarketplace"
      );
    });

    it("should be reverted if caller is not the owner", async () => {
      await expect(
        marketplaceContract.removeItem(NFTMockContract.address, FIRST_ITEM_ID)
      ).to.be.revertedWithCustomError(marketplaceContract, "CallerIsNotOwner");
    });

    it("should remove the item from listing", async () => {
      await expect(
        marketplaceContract
          .connect(user1)
          .removeItem(NFTMockContract.address, FIRST_ITEM_ID)
      )
        .to.emit(marketplaceContract, "ItemRemoved")
        .withArgs(FIRST_ITEM_ID, NFTMockContract.address);

      const item = await marketplaceContract.itemByAddressAndId(
        NFTMockContract.address,
        FIRST_ITEM_ID
      );
      expect(item.price).to.equal(0);
    });
  });

  describe("updating an item", async () => {
    beforeEach(async () => {
      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);
    });

    it("should be reverted if item does not exist", async () => {
      await expect(
        marketplaceContract.updateItem(
          NFTMockContract.address,
          SECOND_ITEM_ID,
          ITEM_PRICE_EXAMPLE
        )
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "ItemIsNotListedInTheMarketplace"
      );
    });

    it("should be reverted if new price is not greater than zero", async () => {
      const newPrice = 0;
      await expect(
        marketplaceContract.updateItem(
          NFTMockContract.address,
          FIRST_ITEM_ID,
          newPrice
        )
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "PriceMustBeGreaterThanZero"
      );
    });

    it("should change item price correctly", async () => {
      const newPrice = ITEM_PRICE_EXAMPLE.mul(2);

      await expect(
        marketplaceContract.updateItem(
          NFTMockContract.address,
          FIRST_ITEM_ID,
          newPrice
        )
      )
        .to.emit(marketplaceContract, "ItemUpdated")
        .withArgs(FIRST_ITEM_ID, NFTMockContract.address, newPrice);

      const item = await marketplaceContract.itemByAddressAndId(
        NFTMockContract.address,
        FIRST_ITEM_ID
      );
      expect(item.price).to.equal(newPrice);
    });
  });

  describe("buy an item", async () => {
    beforeEach(async () => {
      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);

      await NFTMockContract.mock.safeTransferFrom.returns();
    });

    it("should be reverted if items does not exist", async () => {
      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, SECOND_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "ItemIsNotListedInTheMarketplace"
      );
    });

    it("should be reverted if buyer is the same as seller", async () => {
      await expect(
        marketplaceContract
          .connect(user1)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ethers.utils.parseEther("1"),
          })
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "SellerCannotBuyItsOwnItem"
      );
    });

    it("should be reverted if payment is not exactly equal to item price", async () => {
      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ethers.utils.parseEther("0.9"),
          })
      ).to.be.revertedWithCustomError(marketplaceContract, "PaymentIsNotExact");

      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ethers.utils.parseEther("1.1"),
          })
      ).to.be.revertedWithCustomError(marketplaceContract, "PaymentIsNotExact");
    });

    it("should be done successfully", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      )
        .to.emit(marketplaceContract, "ItemBought")
        .withArgs(
          FIRST_ITEM_ID,
          NFTMockContract.address,
          user1.address,
          ITEM_PRICE_EXAMPLE,
          user2.address
        );
    });

    it("should remove item from the listing after operation is done", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      expect(
        await marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      );

      const item = await marketplaceContract.itemByAddressAndId(
        NFTMockContract.address,
        FIRST_ITEM_ID
      );

      expect(item.seller).to.equal(ethers.constants.AddressZero);
      expect(item.price).to.equal(BigNumber.from("0"));
    });

    it("should update the seller's account balance after discounting platform fee", async () => {
      const platformPayment = await calculatePlatformFee();
      const sellerPayment = ITEM_PRICE_EXAMPLE.sub(platformPayment);

      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      await marketplaceContract
        .connect(user2)
        .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
          value: ITEM_PRICE_EXAMPLE,
        });

      expect(await marketplaceContract.connect(user1).getBalance()).to.equal(
        sellerPayment
      );
    });

    it("should update the seller's account balance correctly after discounting platform fee and royalties", async () => {
      // these royalties are an example
      const royalties = ethers.utils.parseEther("0.15");

      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(true);
      await NFTMockContract.mock.royaltyInfo.returns(user3.address, royalties);
      await NFTMockContract.mock.safeTransferFrom.returns();

      const platformPayment = await calculatePlatformFee();
      const sellerPayment =
        ITEM_PRICE_EXAMPLE.sub(platformPayment).sub(royalties);

      await marketplaceContract
        .connect(user2)
        .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
          value: ITEM_PRICE_EXAMPLE,
        });

      expect(await marketplaceContract.connect(user1).getBalance()).to.equal(
        sellerPayment
      );
    });

    it("should accumulate the balances of seller and platform properly with many purchases", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      // adding a second item
      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, SECOND_ITEM_ID, ITEM_PRICE_EXAMPLE);

      const platformPayment = await calculatePlatformFee();
      const sellerPayment = ITEM_PRICE_EXAMPLE.sub(platformPayment);

      await marketplaceContract
        .connect(user2)
        .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
          value: ITEM_PRICE_EXAMPLE,
        });

      await marketplaceContract
        .connect(user2)
        .buyItem(NFTMockContract.address, SECOND_ITEM_ID, {
          value: ITEM_PRICE_EXAMPLE,
        });

      expect(await marketplaceContract.connect(user1).getBalance()).to.equal(
        sellerPayment.mul(2)
      );
      expect(await marketplaceContract.getBalance()).to.equal(
        platformPayment.mul(2)
      );
    });
  });

  describe("redeem", async () => {
    let salesOrder: any;

    beforeEach(async () => {
      await NFTMockContract.mock.safeTransferFrom.returns();

      salesOrder = await createSalesOrder(
        marketplaceContract.address,
        NFTMockContract.address,
        FIRST_ITEM_ID,
        ITEM_PRICE_EXAMPLE,
        "https://example.uri/ipfs/Qmef",
        chainId,
        user1
      );
    });

    it("should be reverted if buyer and seller are the same address", async () => {
      await expect(
        marketplaceContract.connect(user1).redeem(salesOrder, {
          value: ITEM_PRICE_EXAMPLE,
        })
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "SellerCannotBuyItsOwnItem"
      );
    });

    it("should be reverted if marketplace contract does not have minter role", async () => {
      await NFTMockContract.mock.mint.reverts();

      await expect(
        marketplaceContract.connect(user2).redeem(salesOrder, {
          value: ITEM_PRICE_EXAMPLE,
        })
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "ErrorOnNFTContract"
      );
    });

    it("should be reverted if payment is not exact", async () => {
      await expect(
        marketplaceContract.connect(user2).redeem(salesOrder)
      ).to.be.revertedWithCustomError(marketplaceContract, "PaymentIsNotExact");
    });

    it("should mints a new item to the signer account and transfers it to the buyer", async () => {
      await NFTMockContract.mock.mint.returns();

      await expect(
        marketplaceContract.connect(user2).redeem(salesOrder, {
          value: ITEM_PRICE_EXAMPLE,
        })
      )
        .to.emit(marketplaceContract, "ItemBought")
        .withArgs(
          FIRST_ITEM_ID,
          NFTMockContract.address,
          user1.address,
          ITEM_PRICE_EXAMPLE,
          user2.address
        );
    });

    it("should add the payment fee to the owner's balance", async () => {
      await NFTMockContract.mock.mint.returns();

      const platformPayment = await calculatePlatformFee();

      await marketplaceContract.connect(user2).redeem(salesOrder, {
        value: ITEM_PRICE_EXAMPLE,
      });
      expect(await marketplaceContract.connect(deployer).getBalance()).to.equal(
        platformPayment
      );
    });

    it("should add the payment to the seller's balance", async () => {
      await NFTMockContract.mock.mint.returns();

      const platformPayment = await calculatePlatformFee();
      const sellerPayment = ITEM_PRICE_EXAMPLE.sub(platformPayment);

      await marketplaceContract.connect(user2).redeem(salesOrder, {
        value: ITEM_PRICE_EXAMPLE,
      });
      expect(await marketplaceContract.connect(user1).getBalance()).to.equal(
        sellerPayment
      );
    });
  });

  describe("withdrawal", async () => {
    let platformPayment: BigNumber, sellerPayment: BigNumber;

    beforeEach(async () => {
      platformPayment = await calculatePlatformFee();
      sellerPayment = ITEM_PRICE_EXAMPLE.sub(platformPayment);

      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);
    });

    it("should be reverted if there is no payment available to withdraw", async () => {
      await expect(
        marketplaceContract.connect(user1).withdrawPayments()
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "NoPaymentsAvailableToWithdraw"
      );
    });

    it("should be done successfully", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      );

      await expect(
        await marketplaceContract.connect(user1).withdrawPayments()
      ).to.changeEtherBalance(user1, sellerPayment);

      await expect(
        await marketplaceContract.withdrawPayments()
      ).to.changeEtherBalance(deployer, platformPayment);
    });

    it("should be reverted if trying to withdraw twice in a row", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      expect(
        await marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      );

      await expect(
        await marketplaceContract.connect(user1).withdrawPayments()
      ).to.changeEtherBalance(user1, sellerPayment);

      await expect(
        marketplaceContract.connect(user1).withdrawPayments()
      ).to.be.revertedWithCustomError(
        marketplaceContract,
        "NoPaymentsAvailableToWithdraw"
      );
    });
  });

  describe("royalties payment", async () => {
    beforeEach(async () => {
      await marketplaceContract
        .connect(user1)
        .addItem(NFTMockContract.address, FIRST_ITEM_ID, ITEM_PRICE_EXAMPLE);
    });

    it("should not be done if item does not implement IERC2981", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();

      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      ).not.to.emit(marketplaceContract, "RoyaltyPaid");
    });

    it("should be done if item implements IERC2189", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(true);
      await NFTMockContract.mock.safeTransferFrom.returns();
      // user3 will be the considered the token author
      await NFTMockContract.mock.royaltyInfo.returns(
        user3.address,
        ethers.utils.parseEther("0.15")
      );

      await expect(
        marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      ).to.emit(marketplaceContract, "RoyaltyPaid");

      await expect(
        await marketplaceContract.connect(user3).withdrawPayments()
      ).to.changeEtherBalance(user3, ethers.utils.parseEther("0.15"));
    });

    it("should not be done if royalties amount is zero", async () => {
      await NFTMockContract.mock.supportsInterface
        .withArgs(IERC2981_ID)
        .returns(false);
      await NFTMockContract.mock.safeTransferFrom.returns();
      // user3 will be the considered the token author
      await NFTMockContract.mock.royaltyInfo.returns(
        user3.address,
        ethers.utils.parseEther("0")
      );

      await expect(
        await marketplaceContract
          .connect(user2)
          .buyItem(NFTMockContract.address, FIRST_ITEM_ID, {
            value: ITEM_PRICE_EXAMPLE,
          })
      ).not.to.emit(marketplaceContract, "RoyaltyPaid");

      await expect(
        await marketplaceContract.withdrawPayments()
      ).to.changeEtherBalance(user3, ethers.utils.parseEther("0"));
    });
  });
});
