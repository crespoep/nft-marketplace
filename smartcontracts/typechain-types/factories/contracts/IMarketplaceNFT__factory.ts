/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IMarketplaceNFT,
  IMarketplaceNFTInterface,
} from "../../contracts/IMarketplaceNFT";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IMarketplaceNFT__factory {
  static readonly abi = _abi;
  static createInterface(): IMarketplaceNFTInterface {
    return new utils.Interface(_abi) as IMarketplaceNFTInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMarketplaceNFT {
    return new Contract(address, _abi, signerOrProvider) as IMarketplaceNFT;
  }
}
