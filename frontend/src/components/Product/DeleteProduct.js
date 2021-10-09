import deleteIMG from '../../assets/delete-product-btn.png';

const DeleteProduct = ({ productName, deleteProduct }) => {

    const handleClick = (event) => {
        event.preventDefault();
        console.log("PRODUCT NAME", productName);
        deleteProduct(productName)
    }

    return (
        <button type="btn" className="delete-product-btn btn" onClick={handleClick}>
            <img src={deleteIMG} />
        </button>
    );

}

export default DeleteProduct;