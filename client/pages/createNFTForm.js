import { useState } from "react";
import { ethers } from "ethers"

const CreateNFTForm = () => {
  const [ formInput, updateFormInput ] = useState({
    image: null,
    name: "",
    price: ""
  })

  const onFileChange = async e => {
    const file = e.target.files[0];
    updateFormInput({ ...formInput, image: file })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // improve validations
    if (!formInput.name || !Number(formInput.price) || !formInput.image) {
      return;
    }

    const data = {...formInput}
    data.price = ethers.utils.parseUnits(formInput.price, "ether")

    const body = new FormData();
    body.append("name", formInput.name)
    body.append("price", formInput.price)
    body.append("image", formInput.image)

    const res = await fetch('/api/nft/create', {
      method: "POST",
      body: body
    })
    console.log(res)
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
