import deleteIMG from '../../assets/delete-product-btn.png';

const DeleteProduct = ({ productName, deleteProduct }) => {

    const handleClick = (productName) = (event) => {
        event.preventDefault();
        deleteProduct(productName)
    }

    return (
        <button type="btn" className="delete-product-btn btn">
            <img src={deleteIMG} onClick={handleClick}/>
        </button>
    );

}

export default DeleteProduct;