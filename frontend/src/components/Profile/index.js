import { useEffect, useState } from "react"
import api from "../../Api/ApiObject";
import NavBar from "../Navbar";
import ConsumerInfo from "./ConsumerInfo";
import OrdersHistory from "./OrdersHistory"

const Profile = () => {

  const [consumer, setConsumer] = useState({});
  const [ordersHistory, setOrdersHistory] = useState([]);

  useEffect(() =>{
    getConsumer();
  }, []);

  useEffect(() =>
    getOrdersHistory()
  , [])

  const getConsumer = () => {
    api.getConsumer()
    .then(response => {
      setConsumer(response.data);
    })
    .catch(err => {
      console.log(err);
    });
  }

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
    <div className="pb-4">
      <NavBar />
      <ConsumerInfo 
        username={consumer.username}
        email={consumer.email}
        telephone={consumer.telephone} />
      <OrdersHistory ordersHistory={ordersHistory}/>
    </div>
  )
}

export default Profile
