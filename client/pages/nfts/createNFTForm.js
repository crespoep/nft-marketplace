import { useState } from "react";
import { ethers } from "ethers"
import Image from "next/image";

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
      console.log("form has errors")
      return;
    }

    const data = {...formInput}
    data.price = ethers.utils.parseUnits(formInput.price, "ether")

    const body = new FormData();
    body.append("name", formInput.name)
    body.append("price", formInput.price)
    body.append("image", formInput.image)

    const res = await fetch('/api/nfts/create', {
      method: "POST",
      body: body
    })
    console.log(res)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col text-xl w-full sm:w-96">
      <div className="flex flex-col flex-2 sm:flex-row justify-between m-2">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formInput.name}
          onChange={e => updateFormInput({ ...formInput, name: e.target.value})}
          className="border-2 border-sky-500 rounded-md"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between m-2">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value})}
          className="border-2 border-sky-500 rounded-md"
        />
      </div>
      <div className="flex justify-end m-2">
        <label htmlFor="image" className="flex items-center bg-slate-200 rounded p-2">
          <span>Upload file</span>
          <Image src="/upload-64.png" width={45} height={45} />
        </label>
        <input
          type="file"
          id="image"
          onChange={onFileChange}
          className="hidden border-2 border-sky-500 rounded-md"
        />
      </div>
      <div className="flex justify-end m-2">
        <label htmlFor="lazy-minting"></label>
        <ul
          className="items-center w-full text-gray-900 rounded-lg border border-gray-200 sm:flex">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="horizontal-list-radio-license"
                type="radio"
                value=""
                name="list-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
              />
                <label
                  htmlFor="horizontal-list-radio-license"
                  className="py-3 ml-2 w-full text-lg text-gray-900"
                >
                  Mint now
                </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="horizontal-list-radio-id"
                type="radio"
                value=""
                name="list-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
              />
                <label
                  htmlFor="horizontal-list-radio-id"
                  className="py-3 ml-2 w-full text-lg text-gray-900"
                >
                  Lazy-mint
                </label>
            </div>
          </li>
        </ul>
      </div>
      <button type="submit" className="justify-center items-center bg-sky-500 rounded-md flex p-2 m-2">
        Create
      </button>
    </form>
  )
}

export default CreateNFTForm
