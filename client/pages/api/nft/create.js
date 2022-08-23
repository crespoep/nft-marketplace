import { createIpfsUrl } from "../../../services/IPFS";
import { bodyParser } from "../../../services/formidable";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const action = req.query.action;
      const { data, file } = await bodyParser(req)

      if ('createImageInIPFS' === action) {
        const image = await createIpfsUrl(file)
        res.status(201).json({
          message: "Image created successfully",
          image: image
        })
      } else if ('createMetadataInIPFS' === action) {
        //Create NFT Metadata on IPFS
        const jsonData = JSON.stringify(data)
        const tokenURI = await createIpfsUrl(jsonData)

        res.status(201).json({
          message: "Metadata created successfully",
          tokenURI: tokenURI
        })
      }
    }catch(e) {
      console.log(e)
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
