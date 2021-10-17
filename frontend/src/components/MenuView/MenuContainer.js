import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import ViewProducts from "../Product/ViewProducts";
import Notebook from "../Notebook";

const getPizzeriaName = () => localStorage.getItem('username')

const MenuContainer = () => {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMenu();
  }, [])

  const getMenu = () => {
    api.getMenu(getPizzeriaName())
      .then(response => {
        setProducts(response.data)
        setError("")
      })
      .catch(_ => {
        setError("Error")
      })
  }

  const deleteProduct = (productName) => {
    api.deleteProduct(getPizzeriaName(), productName);
    const newProducts = products.filter((product) => product.name !== productName);
    setProducts(newProducts);
  }

  return (
    <div>
      {error ? <h3>Ocurrio un error al cargar los productos</h3> :
        <ViewProducts products={products} deleteProduct={deleteProduct} />
      }
    </div>
  );


}

export default MenuContainer;