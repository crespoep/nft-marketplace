import {useEffect, useState} from "react";
import { getLastCreated } from "../services/contractApi";

export default function RecentlyCreated() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const items = await getLastCreated();

        setItems(items)
        // setLoading(false)
      } catch (e) {
        // setLoading(false)
        console.log("Check your network: ", e)
      }
    }
    fetchRecentItems()
  }, [])

  return (
    items.length > 0
    ? <ul>
      {
        items.map(i => <li>33</li>)
      }
      </ul>
    : null
  )
}
