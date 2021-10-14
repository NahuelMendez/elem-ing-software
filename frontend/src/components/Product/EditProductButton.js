import imageIMG from '../../assets/edit-product-btn.png';

const EditProductButton = ({ onClick }) =>
    <button type="btn" className="edit-product-btn btn" onClick={onClick} >
        <img src={imageIMG} />
    </button>

export default EditProductButton