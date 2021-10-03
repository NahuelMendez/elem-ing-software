import { useContext, useState } from "react";
import api from "../../Api/ApiObject";
import Product from "../Product/Product";

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
            console.log(response)
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
            {products.map( product => {
                <Product 
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    imageURL={product.imageURL}/>
            })}
        </div>
    );


}

export default MenuContainer;