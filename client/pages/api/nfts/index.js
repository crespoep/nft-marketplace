import { getDocuments } from "../../../services/DB";

export default async (req, res) => {
  const doc = await getDocuments();
  console.log(doc)
  res.status(200).json(doc)
}
