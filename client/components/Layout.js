import styles from './layout.module.css'
import { useState } from "react";
import Head from 'next/head'
import Image from "next/image";
import Header from "./Header";

export default function Layout({ children }) {
  const [ account, setAccount ] = useState(null)
  const [ balance, setBalance ] = useState(null)

  return (
    <>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <title>NFT marketplace</title>
      </Head>
      <Header account={account} setAccount={setAccount} balance={balance} setBalance={setBalance} />
      <main className="">{children}</main>
      <footer className="">
        Powered by{' '}
        <span className="">
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </footer>
    </>
  );
}
