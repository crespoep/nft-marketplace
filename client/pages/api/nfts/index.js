import { getNFTs } from "../../../services/DB";

export default async (req, res) => {
  const doc = await getNFTs();
  console.log(doc)
  res.status(200).json(doc)
}
