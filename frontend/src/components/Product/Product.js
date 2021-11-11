import React, { useState } from 'react';
import api from '../../Api/ApiObject'
import Modal from '../Modal'
import EditProductButton from './EditProductButton'
import DeleteProduct from './DeleteProduct';
import DeleteProductButton from './DeleteProductButton';
import EditProductForm from './EditProductForm'
import addIcon from '../../assets/plus.png';
import { useDispatch } from "react-redux"
import { addProduct } from '../../slices/notebookSlice';
import { useParams } from 'react-router';


const Product = ({ name, description, price, imageURL, deleteProduct, editMode }) => {

  const [showEditionForm, setShowEditionForm] = useState(false)
  const dispatch = useDispatch()
  const { pizzeriaName } = useParams();
  const [showDelete, setShowDelete] = useState(false)

    const handleClick = () => {
        setShowDelete(true)
    }

    const handleClose = () => {
        setShowDelete(false)
    }

  const handleAddToNotebook = () => {
    dispatch(addProduct({
      name,
      price,
      pizzeriaName
    }))
  }

  return (
    <>
      <div className="card card-container product-container">
        <div className="flex justify-end">
          {editMode ?
            <div>
              <EditProductButton onClick={() => setShowEditionForm(true)} />
              <DeleteProductButton handleClick={handleClick}/>
            </div>
            :
            <button type="btn" className="w-8 pt-2 pr-2 h-8 button-add" onClick={handleAddToNotebook}>
              <img src={addIcon} />
            </button>}
        </div>

        <div className="card-img-cont">
          <img src={imageURL} alt="" className="product-img"></img>
        </div>

        <div className="card-body">
          <h2 className="card-tittle">{name}</h2>
          <p className="card-text text-secondary">{description}</p>
          <p><b>${price}</b></p>
        </div>
      </div>
      {
        showEditionForm &&
        <Modal
          handleClose={() => setShowEditionForm(false)}
          title={"Editar producto"}
          body={
            <EditProductForm
              product={{ name, description, price, imageURL, deleteProduct }}
              handleSubmit={
                editedProduct =>
                  api
                    .updateProduct(name, editedProduct)
                    .then(() => window.location.reload())
              }
            />
          }
        />
      }
      {showDelete && <Modal 
          title={"Borrar producto"} 
            body={
              <div>
                <div className="mt-8 mb-4">
                  <h5>¿Esta seguro que quiere borrar el producto?</h5>
                </div>
                <div class="flex justify-around">
                  <DeleteProduct productName={name} deleteProduct={deleteProduct} />
                  <button type="btn" className="w-24 mt-4 button-principal" onClick={handleClose}>No</button>
                </div>
              </div>
            } 
          handleClose={handleClose}
      />}
    </>
  );
}

export default Product;