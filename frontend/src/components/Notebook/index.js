import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router"
import { productsState, removeProduct } from "../../slices/notebookSlice"
import  deleteIcon from "../../assets/delete-icon.png"

const Notebook = () => {
  const [productsToShow, setProductsToShow] = useState([])
  const [total, setTotal] = useState(0)
  const products = useSelector(productsState)
  const { pizzeriaName } = useParams();
  const dispatch = useDispatch()

  useEffect(() => {
    const toShow = products.filter(i => i.pizzeriaName === pizzeriaName)
    setProductsToShow(toShow)
  }, [products])

  useEffect(() => {
    const totalToSave = productsToShow.reduce((subTotal, product) => subTotal + product.price * product.cant, 0)
    setTotal(totalToSave)
  }, [productsToShow])

  const handleDeleteProduct = (product) => {
    dispatch(removeProduct(product))
  }

  return (
    <div className="card border-gray-500 border w-1/5 p-4 flex flex-col notebook-container">
      {
        productsToShow.map((i, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div className="mr-4">
              <p className="m-0 font-semibold name-product">{i.name}</p>
              <p className="text-xs m-0 price-product text-gray-500">$ {i.price}</p>
            </div>
            <div>
              <p className="text-xs m-0 unit-product text-gray-500">x{i.cant}</p>
            </div>
            <img src={deleteIcon} className="delete-product h-6 w-auto cursor-pointer" onClick={() => handleDeleteProduct(i)} alt="delete-icon"/>
          </div>
        ))
      }
      <div className="flex justify-between">
        <p className="font-semibold">TOTAL</p>
        <p className="total font-semibold">${total}</p>
      </div>
    </div>
  )
}

export default Notebook
