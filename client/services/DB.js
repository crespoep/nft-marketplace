import clientPromise from "../lib/mongodb";

const getLastTokenId = async () => {
  const client = await clientPromise;
  const db = client.db();
  const collection = process.env.MONGODB_COLLECTION;

  const lastItem = await db
    .collection(collection)
    .find({tokenId: {$exists: true}})
    .toArray();

  return (typeof(lastItem?.[0]?.tokenId) != 'undefined') ? lastItem[0].tokenId : 0
}

const getDocuments = async () => {
  const client = await clientPromise;
  const db = client.db()
  const collection = process.env.MONGODB_COLLECTION

  return await db
    .collection(collection)
    .find({})
    .toArray();
}

const createDocument = async data => {
  const client = await clientPromise;
  const db = client.db();
  const collectionName = process.env.MONGODB_COLLECTION;

  const collection = db.collection(collectionName);

  return await collection.insertOne(data);
}

export {
  getDocuments
}
