import { create } from 'ipfs-http-client'

const createIpfsUrl = async file => {
  try {
    const client = await getIpfsClient();
    const added = await client.add(file)
    return added.path;
  } catch(e) {
    console.log("Error: ", e)
  }
}

const getIpfsClient = async () => {
  const auth = "Basic " + Buffer.from(
    process.env.NEXT_PUBLIC_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_PROJECT_SECRET
  ).toString('base64')

  return create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    }
  });
}

export {
  getIpfsClient,
  createIpfsUrl
}
