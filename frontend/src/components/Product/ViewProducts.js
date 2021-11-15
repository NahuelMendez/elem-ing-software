import Product from "./Product";

const ViewProducts = ({ products, deleteProduct, editMode }) => {

  return (
    <div className="w-full flex flex-wrap">
      {products.map((product, index) =>
        <Product
          key={index}
          name={product.name}
          description={product.description}
          price={product.price}
          imageURL={product.imageURL}
          deleteProduct={deleteProduct}
          editMode={editMode} />
      )}
    </div>
  );

}

export default ViewProducts;