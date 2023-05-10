import Navbar from "./Navbar";
import AccountBalanceLabel from "./AccountBalanceLabel";
import { getActiveAddress, getBalance } from "../services/ethereumConnectionManager";
import { useAccountContext } from "./Context/AppContext"
import {useState} from "react";

const Header = () => {
  const {account, setAccount} = useAccountContext()
  const [balance, setBalance] = useState(null)

  const connectWallet = async () => {
    const { signerAddress } = await getActiveAddress();
    setAccount(signerAddress)
    const balance = await getBalance(signerAddress)
    setBalance(balance);
  }

  return (
    <header className="flex flex-row justify-end h-14 items-center bg-sky-500 w-full">
      <div className="flex flex-row items-center">
        <Navbar account={account} />
        {
          account
            ? <AccountBalanceLabel account={account} balance={balance} />
            : <button
                id="connectWallet"
                className="text-green font-bold rounded-2xl p-2"
                onClick={connectWallet}
              >
                Connect wallet
              </button>
        }
      </div>
    </header>
  )
}

export default Header;
