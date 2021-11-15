import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import userIMG from "../../assets/user.png"
import locationIcon from "../../assets/location-icon.png"
import emailIcon from "../../assets/email-icon.png"
import telephoneIcon from "../../assets/telephone-icon.png"

const PizzeriaInfo = ({ pizzeriaName }) => {

  const [pizzeria, setPizzeria] = useState({ username: '', telephone: '', email: '', address: '' });
  const [error, setError] = useState("");

  const getPizzeria = () => {
    api.getPizzeria(pizzeriaName)
      .then((response => {
        setPizzeria(response.data);
      }))
      .catch(err => {
        console.log(err);
        setError("Error");
      });
  }

  useEffect(() => {
    getPizzeria();
  }, []);

  if (error) {
    return (
      <h2 className="error-piz-nf">No se encontro la pizzeria</h2>
    );
  } else {
    return (
      <div className="piz-info-container mt-8">
        <div className="piz-info-body-container border border-gray-500 pl-4">
          <div className="piz-info-body mt-4 mb-2">
            <div className="flex flex-column items-center my-2 mx-4">
              <div className="pizz-info-image cursor-pointer rounded-full h-20 w-20 flex items-center justify-center border border-gray-500">
                <img className="rounded-full h-20 w-20 border border-black-500" src={userIMG}></img>
              </div>
              <p className="p-0 m-0 text-center font-bold text-lg">{pizzeria.username}</p>
            </div>
            <div className="pizz-info-dtl">
              <ul>
                <li className="d-flex mb-3"><img className={"icon-data-img"} src={telephoneIcon}/>{pizzeria.telephone}</li>
                <li className="d-flex mb-3"><img className={"icon-data-img"} src={emailIcon}/>{pizzeria.email}</li>
                <li className="d-flex mb-3"><img className={"icon-data-img"} src={locationIcon}/>{pizzeria.address}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default PizzeriaInfo;