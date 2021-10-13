import React from 'react';
import EditProductButton from './EditProductButton'
import DeleteProductButton from './DeleteProductButton';

const Product = ({ name, description, price, imageURL, deleteProduct }) => {
  return (
    <div className="card card-container">
      <div className="flex justify-end">
        <EditProductButton />
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
  );
}

export default Product;