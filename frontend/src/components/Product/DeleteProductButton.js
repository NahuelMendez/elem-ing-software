import deleteIMG from '../../assets/delete-product-btn.png';

const DeleteProductButton = ({ productName, deleteProduct }) => {

    const handleClick = (event) => {
        event.preventDefault();
        deleteProduct(productName)
    }

    return (
        <button type="btn" className="delete-product-btn btn" onClick={handleClick}>
            <img src={deleteIMG} />
        </button>
    );

}

export default DeleteProductButton;