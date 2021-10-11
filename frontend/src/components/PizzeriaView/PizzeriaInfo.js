import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import userIMG from "../../assets/user.png"

const PizzeriaInfo = ({ pizzeriaName }) => {

    const [pizzeria, setPizzeria] = useState({ username: '', telephone: '', email: '' });

    const getPizzeria = () => {
        api.getPizzeria(pizzeriaName)
        .then((response => {
            setPizzeria(response.data);
        }))
        .catch( err => {
            console.log(err)
        });
    }

    useEffect(() => {
        getPizzeria();
        console.log("Pizzeria", pizzeria)
    }, []);

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
                            <li>{pizzeria.telephone}</li>
                            <li>{pizzeria.email}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default PizzeriaInfo;