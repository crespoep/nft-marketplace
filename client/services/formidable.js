import formidable from "formidable-serverless"
import fs from "fs"

const bodyParser = async req => {
  const body = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    })
  })

  const data = body.fields;

  const filepath = body?.files?.image?.path;

  const file = (typeof filepath !== 'undefined') ? fs.readFileSync(filepath) : null;

  return { data, file }
}

export {
  bodyParser
}
