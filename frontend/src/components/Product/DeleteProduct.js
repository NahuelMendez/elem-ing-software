
const DeleteProduct = ({productName, deleteProduct}) => {

    const handleClick = (event) => {
        event.preventDefault();
        deleteProduct(productName)
    }

    return (
        <>
            <button name="accept" type="btn" className="w-24 mt-4 button-principal" onClick={handleClick}>
                Si
            </button>
        </>
    )

}

export default DeleteProduct;