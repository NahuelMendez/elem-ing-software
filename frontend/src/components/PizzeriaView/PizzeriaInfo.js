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
        .catch( err => {
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
            <div className="piz-info-container">
                <div className="piz-info-body-container">
                    <div className="piz-info-body">
                        <div className="pizz-info-image">
                            <img src={userIMG}></img>
                        </div>
                        <div className="pizz-info-dtl">
                            <ul>
                                <li>{pizzeria.username}</li>
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