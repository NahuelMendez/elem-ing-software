import { useSelector } from "react-redux"
import { productsState, totalState } from "../../slices/notebookSlice"

const Notebook = () => {
  const products = useSelector(productsState)
  const total = useSelector(totalState)

  return (
    <div className="border-gray-500 border w-1/5 p-4 flex flex-col">
      {
        products.map((i, index) => (
          <div className="flex justify-between mb-4">
            <div key={index} className="mr-4">
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
        <p>{total}</p>
      </div>
    </div>
  )
}

export default Notebook
