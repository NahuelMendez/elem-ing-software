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

    const deleteProduct = (productName) => {
        const newProducts = products.filter((product) => product.name !== productName);
        setProducts(newProducts);
        console.log("DELETE PRODUCT");
        console.log(productName)
    }

    return (
        <div>
            { error? <h3>Ocurrio un error al cargar los productos</h3>:
            <ViewProducts products={products} deleteProduct={deleteProduct}/>  
            }
        </div>
    );


}

export default MenuContainer;

/**/ 