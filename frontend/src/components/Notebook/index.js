import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { productsState } from "../../slices/notebookSlice"

const Notebook = () => {
  const [productsToShow, setProductsToShow] = useState([])
  const [total, setTotal] = useState(0)
  const products = useSelector(productsState)
  const { pizzeriaName } = useParams();

  useEffect(() => {
    const toShow = products.filter(i => i.pizzeriaName === pizzeriaName)
    setProductsToShow(toShow)
  }, [products])

  useEffect(() => {
    const totalToSave = productsToShow.reduce((subTotal, product) => subTotal + product.price * product.cant, 0)
    setTotal(totalToSave)
  }, [productsToShow])

  return (
    <div className=" border-gray-500 border w-1/5 p-4 flex flex-col notebook-container">
      {
        productsToShow.map((i, index) => (
          <div key={index} className="flex justify-between mb-4">
            <div className="mr-4">
              <p className="m-0 name-product">{i.name}</p>
              <p className="m-0 price-product">$ {i.price}</p>
            </div>
            <div>
              <p className="m-0 unit-product">x{i.cant}</p>
            </div>
          </div>
        ))
      }
      <div className="flex justify-between">
        <p>TOTAL</p>
        <p className="total">${total}</p>
      </div>
    </div>
  )
}

export default Notebook
