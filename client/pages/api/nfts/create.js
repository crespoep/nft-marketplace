import { saveNFT } from "../../../services/DB";
import { createRouter } from "next-connect";

const router = createRouter();

router
  .post(async (req, res, next) => {
    try {
      // validate values before saving

      const result = await saveNFT(JSON.parse(req.body))
      console.log(result)

      return res.status(201).json({
        message: "Metadata created successfully",
        // tokenURI: `${process.env.IPFS_GATEWAY}/${tokenURI}`
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
