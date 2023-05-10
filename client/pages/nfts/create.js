import Layout from "../../components/Layout";
import CreateNFTForm from "./createNFTForm";

export default function Create() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl my-4">Create NFT</h2>
        <CreateNFTForm />
      </div>
    </Layout>
  )
}
