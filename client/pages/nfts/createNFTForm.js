import { useForm } from "react-hook-form";
import Image from "next/image";

const CreateNFTForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const process = async fields => {
    const body = new FormData();
    body.append("name", fields.name)
    body.append("price", fields.price)
    body.append("image", fields.image[0])

    const res = await fetch('/api/nfts/create', {
      method: "POST",
      body: body
    })
    console.log(res)
  }

  return (
    <form onSubmit={handleSubmit(process)} className="flex flex-col text-xl w-full sm:w-96">
      <div className="flex flex-col justify-between m-2">
        <div className="flex flex-col sm:flex-row justify-between">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="border-2 border-sky-500 rounded-md"
            {...register("name", { required: "Name is required", minLength: 3 })}
          />
        </div>
        {errors.name && errors.name.type === "required" && <div className="text-red-500">Name is required</div>}
        {errors.name && errors.name.type === "minLength" && <div className="text-red-500">It should be 3 characters long</div>}
      </div>
      <div className="flex flex-col justify-between m-2">
        <div className="flex flex-col sm:flex-row justify-between">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            className="border-2 border-sky-500 rounded-md"
            {...register("price", { required: true, min: 1 })}
          />
        </div>
        {errors.price && errors.price.type === "required" && <div className="text-red-500">Price is required</div>}
        {errors.price && errors.price.type === "min" && <div className="text-red-500">It should be greater than one</div>}
      </div>
      <div className="flex flex-col justify-end m-2">
        <div className="flex sm:flex-row justify-end">
          <label htmlFor="image" className="flex items-center bg-slate-200 rounded p-2">
            <span>Upload file</span>
            <Image src="/upload-64.png" width={45} height={45} />
          </label>
          <input
            type="file"
            id="image"
            className="hidden border-2 border-sky-500 rounded-md"
            {...register("image", { required: true })}
          />
        </div>
        {
          errors.image && <div className="text-red-500">You must upload a file</div>
        }
      </div>
      <div className="flex justify-end m-2">
        <ul
          className="items-center w-full text-gray-900 rounded-lg border border-gray-200 sm:flex">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="mint-now"
                type="radio"
                name="minting"
                value="0"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                {...register("lazy-minting")}
              />
                <label
                  htmlFor="mint-now"
                  className="py-3 ml-2 w-full text-lg text-gray-900"
                >
                  Mint now
                </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="lazy-mint"
                type="radio"
                name="minting"
                value="1"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                {...register("lazy-minting")}
              />
                <label
                  htmlFor="lazy-mint"
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
