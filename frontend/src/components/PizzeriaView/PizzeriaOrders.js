import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import NavBar from "../Navbar";
import PizzeriaOrdersTable from "./PizzeriaOrdersTable";

const PizzeriaOrders = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders()
    }, []);

    const getOrders = () => {
        api.getPizzeriaOrders()
        .then(response => {
            console.log(response)
            setOrders(response.data)
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <NavBar />
            <PizzeriaOrdersTable />
        </>
    );
};

export default PizzeriaOrders;