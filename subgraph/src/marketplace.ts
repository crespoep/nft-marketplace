import { BigInt } from "@graphprotocol/graph-ts"
import {
  Marketplace,
  ItemAdded,
  ItemBought,
  ItemRemoved,
  ItemUpdated,
  OwnershipTransferred,
  RoyaltyPaid
} from "../generated/Marketplace/Marketplace"
import { Item } from "../generated/schema"

export function handleItemAdded(event: ItemAdded): void {
  const id = event.transaction.from.toHex() + event.params.tokenId.toHex()
  let item = Item.load(id)
  
  if (!item) {
    item = new Item(event.transaction.from.toHex())
  }
  
  item.owner = event.params.seller
  item.price = event.params.price
  item.tokenId = event.params.tokenId
  item.nftAddress = event.params.nftAddress
  
  item.save()
}

export function handleItemBought(event: ItemBought): void {
  const id = event.transaction.from.toHex() + event.params.tokenId.toHex();
  let item = Item.load(id);
  if (!item) {
    item = new Item(event.transaction.from.toHex())
  }
  item.owner = event.params.buyer;
  item.save();
}

export function handleItemUpdated(event: ItemUpdated): void {
  const id = event.transaction.from.toHex() + event.params.tokenId.toHex();
  let item = Item.load(id);
  if (!item) {
    item = new Item(event.transaction.from.toHex())
  }
  item.price = event.params.price;
  item.save();
}
