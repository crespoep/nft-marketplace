import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Link href="/about">this page!</Link>
    </Layout>
  )
}
