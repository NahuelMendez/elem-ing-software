import Product from "./Product";

const ViewProducts = ({ products, deleteProduct }) => {

    

    return(
        <div className="container pizza-menu">
            <div className="row">
                {products.map( product =>
                    <div className="col-md-4">
                        <Product 
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            imageURL={product.imageURL}
                            deleteProduct={deleteProduct}/>
                    </div>
                )}
            </div>
        </div>
    );

}

export default ViewProducts;