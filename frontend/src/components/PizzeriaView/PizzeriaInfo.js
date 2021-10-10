import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";

const PizzeriaInfo = ({ pizzeriaName }) => {

    const [pizzeria, setPizzeria] = useState({ username: '', telephone: '', email: '' });

    const getPizzeria = () => {
        api.getPizzeria('pizzeria')
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
            <div className="pizz-info-image">
            </div>
            <div className="pizz-info-dtl">
                <ul>
                    <li>{pizzeria.username}</li>
                    <li>{pizzeria.telephone}</li>
                    <li>{pizzeria.email}</li>
                </ul>
            </div>
        </div>
    );

}

export default PizzeriaInfo;