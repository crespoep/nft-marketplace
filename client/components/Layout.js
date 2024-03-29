import styles from './layout.module.css'
import Head from 'next/head'
import Image from "next/image";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className={styles.main}>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <title>NFT marketplace</title>
      </Head>
      <Header />
      <main className="w-11/12 m-auto">{children}</main>
      <footer className="flex flex-row justify-center items-center h-14 bg-zinc-500 w-full">
        Powered by{' '}
        <span>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </footer>
    </div>
  );
}
