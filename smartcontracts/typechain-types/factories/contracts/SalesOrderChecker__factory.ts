/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  SalesOrderChecker,
  SalesOrderCheckerInterface,
} from "../../contracts/SalesOrderChecker";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenOwner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct Marketplace.SalesOrder",
        name: "_salesOrder",
        type: "tuple",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6101406040523480156200001257600080fd5b506040518060400160405280601081526020017f4c415a595f4d41524b4554504c414345000000000000000000000000000000008152506040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525060008280519060200120905060008280519060200120905060007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f90508260e081815250508161010081815250504660a08181525050620000e88184846200013760201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff168152505080610120818152505050505050506200024b565b6000838383463060405160200162000154959493929190620001ee565b6040516020818303038152906040528051906020012090509392505050565b6000819050919050565b620001888162000173565b82525050565b6000819050919050565b620001a3816200018e565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620001d682620001a9565b9050919050565b620001e881620001c9565b82525050565b600060a0820190506200020560008301886200017d565b6200021460208301876200017d565b6200022360408301866200017d565b62000232606083018562000198565b620002416080830184620001dd565b9695505050505050565b60805160a05160c05160e0516101005161012051610d426200029b600039600061049b015260006104dd015260006104bc015260006103f101526000610447015260006104700152610d426000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806347301a8314610030575b600080fd5b61004a600480360381019061004591906106af565b610060565b6040516100579190610739565b60405180910390f35b60008061006c836100d2565b90506100ca81848060a001906100829190610763565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610185565b915050919050565b600061017e7ff43bd3fdfe4003e9c85b0eb17bec8913b6949ff3c3e8f099d4a6c27b8be6735d83600001602081019061010b91906107f2565b846020013585604001602081019061012391906107f2565b8660600135878060800190610138919061081f565b6040516101469291906108c1565b60405180910390206040516020016101639695949392919061090c565b604051602081830303815290604052805190602001206101ac565b9050919050565b600080600061019485856101c6565b915091506101a181610218565b819250505092915050565b60006101bf6101b96103ed565b83610507565b9050919050565b6000806041835114156102085760008060006020860151925060408601519150606086015160001a90506101fc8782858561053a565b94509450505050610211565b60006002915091505b9250929050565b6000600481111561022c5761022b61096d565b5b81600481111561023f5761023e61096d565b5b141561024a576103ea565b6001600481111561025e5761025d61096d565b5b8160048111156102715761027061096d565b5b14156102b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102a9906109f9565b60405180910390fd5b600260048111156102c6576102c561096d565b5b8160048111156102d9576102d861096d565b5b141561031a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031190610a65565b60405180910390fd5b6003600481111561032e5761032d61096d565b5b8160048111156103415761034061096d565b5b1415610382576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037990610af7565b60405180910390fd5b6004808111156103955761039461096d565b5b8160048111156103a8576103a761096d565b5b14156103e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103e090610b89565b60405180910390fd5b5b50565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1614801561046957507f000000000000000000000000000000000000000000000000000000000000000046145b15610496577f00000000000000000000000000000000000000000000000000000000000000009050610504565b6105017f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000000000000610647565b90505b90565b6000828260405160200161051c929190610c21565b60405160208183030381529060405280519060200120905092915050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08360001c111561057557600060039150915061063e565b601b8560ff161415801561058d5750601c8560ff1614155b1561059f57600060049150915061063e565b6000600187878787604051600081526020016040526040516105c49493929190610c74565b6020604051602081039080840390855afa1580156105e6573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156106355760006001925092505061063e565b80600092509250505b94509492505050565b60008383834630604051602001610662959493929190610cb9565b6040516020818303038152906040528051906020012090509392505050565b600080fd5b600080fd5b600080fd5b600060c082840312156106a6576106a561068b565b5b81905092915050565b6000602082840312156106c5576106c4610681565b5b600082013567ffffffffffffffff8111156106e3576106e2610686565b5b6106ef84828501610690565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610723826106f8565b9050919050565b61073381610718565b82525050565b600060208201905061074e600083018461072a565b92915050565b600080fd5b600080fd5b600080fd5b600080833560016020038436030381126107805761077f610754565b5b80840192508235915067ffffffffffffffff8211156107a2576107a1610759565b5b6020830192506001820236038313156107be576107bd61075e565b5b509250929050565b6107cf81610718565b81146107da57600080fd5b50565b6000813590506107ec816107c6565b92915050565b60006020828403121561080857610807610681565b5b6000610816848285016107dd565b91505092915050565b6000808335600160200384360303811261083c5761083b610754565b5b80840192508235915067ffffffffffffffff82111561085e5761085d610759565b5b60208301925060018202360383131561087a5761087961075e565b5b509250929050565b600081905092915050565b82818337600083830152505050565b60006108a88385610882565b93506108b583858461088d565b82840190509392505050565b60006108ce82848661089c565b91508190509392505050565b6000819050919050565b6108ed816108da565b82525050565b6000819050919050565b610906816108f3565b82525050565b600060c08201905061092160008301896108e4565b61092e602083018861072a565b61093b60408301876108fd565b610948606083018661072a565b61095560808301856108fd565b61096260a08301846108e4565b979650505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600082825260208201905092915050565b7f45434453413a20696e76616c6964207369676e61747572650000000000000000600082015250565b60006109e360188361099c565b91506109ee826109ad565b602082019050919050565b60006020820190508181036000830152610a12816109d6565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265206c656e67746800600082015250565b6000610a4f601f8361099c565b9150610a5a82610a19565b602082019050919050565b60006020820190508181036000830152610a7e81610a42565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265202773272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b6000610ae160228361099c565b9150610aec82610a85565b604082019050919050565b60006020820190508181036000830152610b1081610ad4565b9050919050565b7f45434453413a20696e76616c6964207369676e6174757265202776272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b6000610b7360228361099c565b9150610b7e82610b17565b604082019050919050565b60006020820190508181036000830152610ba281610b66565b9050919050565b600081905092915050565b7f1901000000000000000000000000000000000000000000000000000000000000600082015250565b6000610bea600283610ba9565b9150610bf582610bb4565b600282019050919050565b6000819050919050565b610c1b610c16826108da565b610c00565b82525050565b6000610c2c82610bdd565b9150610c388285610c0a565b602082019150610c488284610c0a565b6020820191508190509392505050565b600060ff82169050919050565b610c6e81610c58565b82525050565b6000608082019050610c8960008301876108e4565b610c966020830186610c65565b610ca360408301856108e4565b610cb060608301846108e4565b95945050505050565b600060a082019050610cce60008301886108e4565b610cdb60208301876108e4565b610ce860408301866108e4565b610cf560608301856108fd565b610d02608083018461072a565b969550505050505056fea2646970667358221220ed85a9fab2c392ee0db25ef95fab01a64f9a8ec65b50df9f1e82ea8a7954f9ba64736f6c63430008090033";

type SalesOrderCheckerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SalesOrderCheckerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SalesOrderChecker__factory extends ContractFactory {
  constructor(...args: SalesOrderCheckerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SalesOrderChecker> {
    return super.deploy(overrides || {}) as Promise<SalesOrderChecker>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SalesOrderChecker {
    return super.attach(address) as SalesOrderChecker;
  }
  override connect(signer: Signer): SalesOrderChecker__factory {
    return super.connect(signer) as SalesOrderChecker__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SalesOrderCheckerInterface {
    return new utils.Interface(_abi) as SalesOrderCheckerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SalesOrderChecker {
    return new Contract(address, _abi, signerOrProvider) as SalesOrderChecker;
  }
}