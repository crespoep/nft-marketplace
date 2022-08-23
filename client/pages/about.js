import Head from 'next/head'
import Layout from '../components/Layout'
import Link from "next/link";
import {useEffect} from "react";

export default function About() {
  useEffect(() => {
    const func = async () => {
      const et = await fetch('/api/hello')
      console.log(await et.json())

    }
  func()
  }, [])

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
