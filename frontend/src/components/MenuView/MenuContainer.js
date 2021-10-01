import { useContext, useState } from "react";

const MenuContainer = () =>{

    const [products, setProducts] = useState([]);

    useContext(() =>{
        getMenu();
    })

    const getMenu = () =>{
        setProducts([1, 2, 3, 4, 5, 6])
    }

    const handleClick = (event) =>{
        event.preventDefault()
        setProducts(prevstate => [...prevstate, 1])
    }

    return (
        <div>
            <button onClick={handleClick}> aumentar producto </button>
            Soy el contenedor de productos, {products}
        </div>
    );


}

export default MenuContainer;