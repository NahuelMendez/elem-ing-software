import { useState } from "react"
import api from '../../Api/ApiObject';
import NavBar from "../Navbar";

const MyMenu = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    imageURL: ''
  })
  const [result, setResult] = useState({ show: false, message: "", error: false })

  const handleChange = event => {
    const target = event.target
    setProductData(prevState => ({ ...prevState, [target.name]: target.value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    api.addProduct(productData, "pizzeria") // TODO: sacar pizzeria hardcodeada
      .then(_ => {
        setResult({ show: true, message: "Se ha ingresado el producto correctamente", error: false })
      })
      .catch(() => {
        setResult({ show: true, message: "No se ha podido ingresar el producto", error: true })
      })
  }

  return (
    <div>
      <NavBar />
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center mt-8">
        <input placeholder="Nombre" required className="input mb-2" value={productData.name} name={"name"} type={"text"} onChange={handleChange} />
        <input placeholder="Precio" required className="input mb-2" value={productData.price} name={"price"} type={"number"} onChange={handleChange} />
        <input placeholder="Descripción" required className="input mb-2" value={productData.description} name={"description"} type={"text"} onChange={handleChange} />
        <input placeholder="URL imágen" required className="input" value={productData.imageURL} name={"imageURL"} type={"text"} onChange={handleChange} />
        <button className="mt-4 button-principal" type="submit">Agregar producto</button>
      </form>
      {result.show && <p name="product-submition-message" className={`text-center mt-4 ${result.error ? "text-red-500" : "text-green-500"}`}>{result.message}</p>}
    </div>
  )
}

export default MyMenu