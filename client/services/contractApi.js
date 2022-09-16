import { getContract } from "./ethereumConnectionManager";
import { ethers } from "ethers";

const getLastCreated = async () => {
  const { contract } = await getContract();
  return [];
}

// const createSalesOrder = async () => {
//
// }

// const getOpenLotteries = async () => {
//   const { contract } = await getContract();
//
//   const lotteriesIds = await contract.getOpenLotteriesIds();
//
//   return await Promise.all(lotteriesIds.map(
//     async id => await contract.getLottery(id)
//   ))
// }
//
// const participate = async (id, ticket) => {
//   const { contract, signer } = await getContract();
//
//   await contract.connect(signer).participate(
//     parseInt(id),
//     {
//       value: ticket.toString(),
//     }
//   )
// }
//
// const getParticipationsByUser = async () => {
//   const { contract, signerAddress } = await getContract();
//   const participationIds = await contract.getParticipationsByUser(ethers.utils.getAddress(signerAddress))
//
//   return await Promise.all(
//     participationIds.map(async (id) => await contract.getLottery(id))
//   )
// }

export {
  // getOpenLotteries,
  // getParticipationsByUser,
  // participate
  getLastCreated
}
