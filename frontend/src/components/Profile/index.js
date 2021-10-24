import { useEffect, useState } from "react"
import api from "../../Api/ApiObject";
import NavBar from "../Navbar";
import ConsumerInfo from "./ConsumerInfo";

const Profile = () => {

  const [consumer, setConsumer] = useState({});

  useEffect(() =>{
    getConsumer();
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

  return (
    <div className="pb-4">
      <NavBar />
      <ConsumerInfo 
        name={consumer.username}
        email={consumer.email}
        telephone={consumer.telephone} />
    </div>
  )
}

export default Profile
