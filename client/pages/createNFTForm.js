import { useState } from "react";
import { createImageInIPFS, createMetadataInIPFS } from "../services/api";
import { ethers } from "ethers"

const CreateNFTForm = () => {

  const [ formInput, updateFormInput ] = useState({
    image: null,
    name: "",
    price: ""
  })

  const onFileChange = async e => {
    const file = e.target.files[0];
    const result = await createImageInIPFS(file)

    updateFormInput({ ...formInput, image: result.image })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formInput.name || !Number(formInput.price)) {
      return;
    }

    const data = {...formInput}
    data.price = ethers.utils.parseUnits(formInput.price, "ether")

    const result = await createMetadataInIPFS(data)
    console.log(result)
    const res = await fetch('/api/nft/create')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          onChange={onFileChange}
        />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formInput.name}
          onChange={e => updateFormInput({ ...formInput, name: e.target.value})}
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value})}
        />
      </div>
      <button type="submit">
        Create
      </button>
    </form>
  )
}

export default CreateNFTForm
