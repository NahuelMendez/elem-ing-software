import { useState } from "react"

const MyMenu = () => {
  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState("")

  const handleChange = (type, event) => {
    const value = event.target.value
    switch (type) {
      case "price":
        setPrice(value)
        break;
      case "name":
        setProductName(value)
        break;
      default:
        setDescription(value)
        break;
    }
  }

  return (
    <div>
      <form>
        <input value={productName} type={"text"} onChange={(e) => handleChange("name", e)}/>
        <input value={price} type={"number"} onChange={(e) => handleChange("price", e)}/>
        <input value={description} type={"text"} onChange={(e) => handleChange("description", e)}/>
        <button>Agregar producto</button>
      </form>
    </div>
  )
}

export default MyMenu