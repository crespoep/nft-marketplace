import '../styles/globals.css'
import { AccountContextProvider } from "../components/Context/AppContext"

function MyApp({ Component, pageProps }) {
  return (
    <AccountContextProvider>
      <Component {...pageProps} />
    </AccountContextProvider>
  )
}

export default MyApp
