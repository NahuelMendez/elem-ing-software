import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { productsState } from "../../slices/notebookSlice"

const Notebook = () => {
  const [productsToShow, setProductsToShow] = useState([])
  const [total, setTotal] = useState(0)
  const products = useSelector(productsState)
  const { pizzeriaName } = useParams();

  const getTotal = () => {
    let totalSum = 0
    for (let index = 0; index < productsToShow.length; index++) {
      const product = productsToShow[index]
      totalSum += (product.price * product.cant)
    }
    return totalSum
  }

  useEffect(() => {
    const toShow = products.filter(i => i.pizzeriaName === pizzeriaName)
    setProductsToShow(toShow)
  }, [products])

  useEffect(() => {
    const totalToSave = getTotal()
    setTotal(totalToSave)
  }, [productsToShow])

  return (
    <div className="card border-gray-500 border w-1/5 p-4 flex flex-col">
      {
        productsToShow.map((i, index) => (
          <div key={index} className="flex justify-between mb-4">
            <div className="mr-4">
              <p className="m-0">{i.name}</p>
              <p className="m-0">$ {i.price}</p>
            </div>
            <div>
              <p className="m-0">x{i.cant}</p>
            </div>
          </div>
        ))
      }
      <div className="flex justify-between">
        <p>TOTAL</p>
        <p>${total}</p>
      </div>
    </div>
  )
}

export default Notebook
