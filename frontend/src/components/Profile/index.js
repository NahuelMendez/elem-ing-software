import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import api from "../../Api/ApiObject";
import { consumerInfoState } from "../../slices/consumerSlice";
import NavBar from "../Navbar";
import ConsumerInfo from "./ConsumerInfo";
import OrdersHistory from "./OrdersHistory"

const Profile = () => {
  const [ordersHistory, setOrdersHistory] = useState([]);
  const { username, image, telephone, email, address } = useSelector(consumerInfoState);

  useEffect(() =>
    getOrdersHistory()
    , [])

  const getOrdersHistory = () => {
    api.getOrdersHistory()
      .then(response =>
        setOrdersHistory(response.data)
      )
      .catch(err =>
        console.log(err)
      )
  }

  return (
    <div className="mb-4">
      <NavBar />
      <main className="flex flex-inline">
        <ConsumerInfo
          username={username}
          email={email}
          telephone={telephone}
          address={address}
          profilePicture={image} />
        <OrdersHistory ordersHistory={ordersHistory} />
      </main>
    </div>
  )
}

export default Profile
