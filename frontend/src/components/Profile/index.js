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
    getOrdersHistory();
  }, []);

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
    <div className="mb-4">
      <NavBar />
      <main className="flex justify-around w-100">
        <ConsumerInfo 
          username={consumer.username}
          email={consumer.email}
          telephone={consumer.telephone}
          profilePicture={consumer.image} />
        <OrdersHistory ordersHistory={ordersHistory}/>
      </main>
    </div>
  )
}

export default Profile
