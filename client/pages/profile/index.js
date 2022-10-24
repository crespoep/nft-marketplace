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
      <h2>
        <Link href="/">
          Back to home
        </Link>
      </h2>
      <div>
        {account}
      </div>
    </Layout>
  )
}

export default Profile
