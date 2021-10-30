import editIMG from "../../assets/edit-product-btn.png";

const EditProfileButton = ({ onClick }) => {

    return (
        <button onClick={onClick}>Editar<img src={editIMG}></img></button>
    );

}

export default EditProfileButton;