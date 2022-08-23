import { create } from 'ipfs-http-client'

const createIpfsUrl = async file => {
  try {
    const client = await getIpfsClient();

    const added = await client.add(file)

    return `${process.env.IPFS_GATEWAY}${added.path}`;
  } catch(e) {
    console.log("Error: ", e)
  }
}

const getIpfsClient = async () => {
  const auth = "Basic " + Buffer.from(
    process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET
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
