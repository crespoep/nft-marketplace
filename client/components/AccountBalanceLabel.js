
const AccountBalanceLabel = ({ account, balance }) => (
  <div className="flex bg-light-green text-black font-bold rounded-2xl">
    <div className="p-2">
      { account.slice(0, 12) }...
    </div>
    <div className="bg-dark-green rounded-r-2xl text-white p-2">
      { balance } ETH
    </div>
  </div>
)

export default AccountBalanceLabel;
