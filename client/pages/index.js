import Link from "next/link";
import Layout from "../components/Layout";
import RecentlyCreated from "../components/RecentlyCreated";

export default function Home() {
  return (
    <Layout>
      <div>
        <Link href="/collections" className="my-4">See our collections!</Link>
      </div>
      <div>
        <RecentlyCreated />
      </div>
    </Layout>
  )
}
