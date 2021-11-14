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
  const [showDescription, setShowDescription] = useState(false)
  const dispatch = useDispatch()
  const { pizzeriaName } = useParams();
  const [showDelete, setShowDelete] = useState(false)

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
              <DeleteProductButton handleClick={() => setShowDelete(true)}/>
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
          <div className="d-flex">
            <p className="card-text text-secondary text-truncate">{description}</p>
            {description.length > 24 ? <button className="mb-3 fw-bold" onClick={() => setShowDescription(true)}>+</button> : ""}
          </div>
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
              <div name="delete-product">
                <div className="mt-8 mb-4">
                  <h5 name="title">¿Esta seguro que quiere borrar el producto?</h5>
                </div>
                <div class="flex justify-around">
                  <DeleteProduct productName={name} deleteProduct={deleteProduct} />
                  <button name="cancel" type="btn" className="w-24 mt-4 button-principal" onClick={handleClose}>No</button>
                </div>
              </div>
            } 
          handleClose={handleClose}
      />}
      {showDescription && <Modal 
          title={"Descripción"} 
            body={
              <div name="descripcion-product">
                <div className="mt-8 mb-4">
                  <h5 name="title">{description}</h5>
                </div>
              </div>
            } 
          handleClose={() => setShowDescription(false)}
      />}
    </>
  );
}

export default Product;