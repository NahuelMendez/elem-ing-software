import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import ViewProducts from "../Product/ViewProducts";

const MenuContainer = () =>{

    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() =>{
        getMenu();
    }, [])

    const getMenu = () => {
        api.getMenu('pizzeria')
        .then(response => {
            setProducts(response.data)
            setError("")
        })
        .catch(_ => {
            setError("Error")
        })
    }

    return (
        <div>
            { error? <h3>Ocurrio un error al cargar los productos</h3>:
            <ViewProducts products={products}/>  
            }
        </div>
    );


}

export default MenuContainer;

/**/ 