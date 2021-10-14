import React, { useState } from 'react';

import Modal from '../Modal'

import EditProductButton from './EditProductButton'
import DeleteProductButton from './DeleteProductButton';
import EditProductForm from './EditProductForm'

const Product = ({ name, description, price, imageURL, deleteProduct }) => {
  const [showEditionForm, setShowEditionForm] = useState(false)

  return (
    <>
      <div className="card card-container">
        <div className="flex justify-end">
          <EditProductButton onClick={ () => setShowEditionForm(true) } />
          <DeleteProductButton productName={name} deleteProduct={deleteProduct} />
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
          title={"Editar producto"}
          body={
            <EditProductForm
              product={{ name, description, price, imageURL, deleteProduct }}
              handleSubmit={ editedProduct => {} }
            />
          }
        />
      }
    </>
  );
}

export default Product;