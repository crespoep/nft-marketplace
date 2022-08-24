import clientPromise from "../lib/mongodb";

const getNFTs = async () => {
  const client = await clientPromise;
  const db = client.db()
  const collection = process.env.MONGODB_COLLECTION

  return await db
    .collection(collection)
    .find({})
    .toArray();
}

const saveNFT = async data => {
  const client = await clientPromise;
  const db = client.db();
  const collectionName = process.env.MONGODB_COLLECTION;

  const collection = db.collection(collectionName);

  return await collection.insertOne(data)
}

export {
  getNFTs,
  saveNFT
}
