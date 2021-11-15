import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router"
import { productsState, removeAllFromPizzeria, removeProduct } from "../../slices/notebookSlice"
import deleteIcon from "../../assets/delete-icon.png"
import api from "../../Api/ApiObject"

const Notebook = () => {
  const [productsToShow, setProductsToShow] = useState([])
  const [total, setTotal] = useState(0)
  const [result, setResult] = useState(null)
  const products = useSelector(productsState)
  const { pizzeriaName } = useParams();
  const dispatch = useDispatch()

  useEffect(() => {
    const toShow = products.filter(i => i.pizzeriaName === pizzeriaName)
    setProductsToShow(toShow)
    if(products.length > 0 && result){
      handleCloseAlert()
    }
  }, [products])

  useEffect(() => {
    const totalToSave = productsToShow.reduce((subTotal, product) => subTotal + product.price * product.cant, 0)
    setTotal(totalToSave)
  }, [productsToShow])

  const handleDeleteProduct = (product) => {
    dispatch(removeProduct(product))
  }

  const handleConfirm = () => {
    const productsToSend = productsToShow.map(i => {
      return { productName: i.name, quantity: i.cant }
    })
    api.confirmOrder({ pizzeriaName, order: productsToSend })
      .then(() => {
        setResult({ error: false, message: "Tú pedido fue confirmado" })
        dispatch(removeAllFromPizzeria(pizzeriaName))
      })
      .catch(() => {
        setResult({ error: true, message: "Tú pedido no pudo ser confirmado. Por favor, intente nuevamente." })
      })
  }

  const handleCloseAlert = () => {
    setResult(null)
  }

  return (
    <div className="border-gray-500 border w-5/6 ml-4 mt-4 p-4 flex flex-col justify-between notebook-container">
      <div>
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
              <img name="delete-product" onClick={() => handleDeleteProduct(i)} src={deleteIcon} className="delete-product h-6 w-auto cursor-pointer" alt="delete-icon" />
            </div>
          ))
        }
        {result && 
          <div className={`alert ${result.error ? "alert-danger" : "alert-success"} alert-confirm flex flex-col`} role="alert">
            <div onClick={handleCloseAlert} className="flex justify-end font-bold cursor-pointer">x</div>
            <p className="m-0 p-0 text-sm">{result.message}</p>
          </div>
        }
        <div className="flex justify-between">
          <p className="font-semibold">TOTAL</p>
          <p className="total font-semibold">${total}</p>
        </div>
      </div>
      {products.length !== 0 &&
        <div className="w-full flex justify-center">
          <button name="confirm-button" onClick={handleConfirm} className="button-principal w-4/5">Confirmar</button>
        </div>
      }
    </div>

  )
}

export default Notebook
