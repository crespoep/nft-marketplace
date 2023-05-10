import Head from 'next/head'
import Layout from '../components/Layout'
import Link from "next/link";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>New title</title>
      </Head>
      <h2>
        <Link href="/">
          Back to home
        </Link>
      </h2>
    </Layout>
  );
}
