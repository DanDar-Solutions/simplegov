import clientPromise from "../../lib/database"; // adjust path to your helper

export async function saveData(collectionName: string, payload: any) {
  const client = await clientPromise;
  const db = client.db("myDatabase"); // replace with your DB name
  const result = await db.collection(collectionName).insertOne(payload);
  return result.insertedId;
}

export async function fetchData(collectionName: string) {
  const client = await clientPromise;
  const db = client.db("myDatabase"); // replace with your DB name
  const data = await db.collection(collectionName).find({}).toArray();
  return data;
}
