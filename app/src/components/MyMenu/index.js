import { useState } from "react"
import api from '../../Api/ApiObject';
import NavBar from "../Navbar";

const MyMenu = () => {
  const [producData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    imageURL: ''
  })

  const handleChange = event => {
    const target = event.target
    setProductData(prevState => ({ ...prevState, [target.name]: target.value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("PRODUCT DATA", producData)
    api.addProduct({menu: [producData]}, "pizzeria")
      .then(_ => {
        console.log("PRODUCT DATA", producData)
      })
      .catch(error => console.log(error.response.data.result))
  }

  return (
    <div>
      <NavBar/>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center mt-8">
          <input placeholder="Nombre" required className="input mb-2" value={producData.name} name={"name"} type={"text"} onChange={handleChange} />
          <input placeholder="Precio" required className="input mb-2" value={producData.price} name={"price"} type={"number"} onChange={handleChange} />
          <input placeholder="Descripción" required className="input mb-2" value={producData.description} name={"description"} type={"text"} onChange={handleChange} />
          <input placeholder="URL imágen" required className="input" value={producData.imageURL} name={"imageURL"} type={"text"} onChange={handleChange} />
        <button className="mt-4 font-medium rounded-lg focus:outline-none p-2 bg-principal text-white" type="submit">Agregar producto</button>
      </form>
    </div>
  )
}

export default MyMenu