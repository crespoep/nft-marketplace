import {useContext, createContext, useState, useMemo, useEffect} from "react";

export const AccountContext = createContext(null)

export const AccountContextProvider = ({ children }) => {
  const [account, setAccount] = useState(null)

  useEffect(() => {
  }, [])

  const values = useMemo(() => (
    { account, setAccount }), [account]
  );

  return <AccountContext.Provider value={values}>{children}</AccountContext.Provider>
}

export function useAccountContext() {
  const context = useContext(AccountContext)

  if (!context) {
    console.error("There is no context")
  }
  return context
}

export default useAccountContext;
