import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import ViewProducts from "../Product/ViewProducts";

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
    api.deleteProduct(getPizzeriaName(), productName)
      .then(_ => {
        const newProducts = products.filter((product) => product.name !== productName);
        setProducts(newProducts);
        setError("")
      })
      .catch(_ => {
        setError("Error")
      })
  }

  return (
    <div className="w-full flex justify-center">
      {error ? <h3>Ocurrio un error al cargar los productos</h3> :
        <div className="w-5/6">
          <ViewProducts products={products} deleteProduct={deleteProduct} editMode={true} />
        </div>
      }
    </div>
  );


}

export default MenuContainer;