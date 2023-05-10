import Layout from "../../components/Layout";
import Head from "next/head";
import Link from "next/link";
import { useAccountContext } from "../../components/Context/AppContext"

const Profile = () => {
  const { account } = useAccountContext()

  return (
    <Layout>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="text-2xl my-5">
        <ul>
          <li className="my-2">
            <Link href="/nfts/create">
              Create an NFT
            </Link>
          </li>
          <li>
            <Link href="/">
              Back to home
            </Link>
          </li>
        </ul>
      </div>
      <div>
        {account}
      </div>
    </Layout>
  )
}

export default Profile
