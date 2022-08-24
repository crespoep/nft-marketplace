import { createIpfsUrl } from "../../../services/IPFS";
import { bodyParser } from "../../../services/formidable";
import { createRouter } from "next-connect";

const router = createRouter();

router
  .post(async (req, res, next) => {
    try {
      let { data, file } = await bodyParser(req)
      const image = await createIpfsUrl(file)

      data = {...data, image}
      const jsonData = JSON.stringify(data)
      const tokenURI = await createIpfsUrl(jsonData)

      data = {...data, tokenURI}

      await saveNFT(data)

      return res.status(201).json({
        message: "Metadata created successfully",
        tokenURI: `${process.env.IPFS_GATEWAY}/${tokenURI}`
      })
    } catch(e) {
      console.log(e)
    }
  })

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).json("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).json("Page is not found");
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
};
