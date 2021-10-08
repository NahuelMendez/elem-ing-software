import deleteIMG from '../../assets/delete-product-btn.png';

const DeleteProduct = ({ productName }) => {

    const deleteProduct = (event) => {
        event.preventDefault();
        // api borrar productName
        console.log("Se borra producto");
    }

    return (
        <button type="btn" className="delete-product-btn btn">
            <img src={deleteIMG} onClick={deleteProduct}/>
        </button>
    );

}

export default DeleteProduct;