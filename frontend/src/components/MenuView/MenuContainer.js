import { useContext, useState } from "react";
import api from "../../Api/ApiObject";

const MenuContainer = () =>{

    const [data, setData] = useState({name: '', password: ''})
    const [products, setProducts] = useState([]);

    useContext(() =>{
        getMenu();
    })

    const getMenu = () =>{
        api.getMenu(data, 'pizzeria')
        .then(response => {
            setProducts(response.body)
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    const handleClick = (event) =>{
        event.preventDefault()
        setProducts(prevstate => [...prevstate, 1])
        getMenu()
    }

    return (
        <div>
            <button onClick={handleClick}> aumentar producto </button>
            Soy el contenedor de productos, {products}
        </div>
    );


}

export default MenuContainer;