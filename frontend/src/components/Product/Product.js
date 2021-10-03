const Product = ({ name, description, price, imageURL }) => {
    return (
        <div>
            {name}
            {description}
            {price}
            {imageURL}
        </div>
    );
}

export default Product;