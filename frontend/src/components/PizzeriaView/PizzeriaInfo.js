import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import userIMG from "../../assets/user.png"

const PizzeriaInfo = ({ pizzeriaName }) => {

  const [pizzeria, setPizzeria] = useState({ username: '', telephone: '', email: '' });
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
      <div className="w-3/4 flex justify-start mt-8">
        <div className="w-4/5">
          <div className="piz-info-body-container">
            <div className="piz-info-body">
              <div>
                <div className="flex justify-center px-4 pt-4 cmr-info-image">
                  <img className="rounded-full h-20 w-20 border border-black-500" src={userIMG} />
                </div>
                <p className="text-center font-bold text-lg">{pizzeria.username}</p>
              </div>
              <div className="pizz-info-dtl flex flex-column text-lg justify-center">
                <ul>
                  <li>{pizzeria.telephone}</li>
                  <li>{pizzeria.email}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default PizzeriaInfo;