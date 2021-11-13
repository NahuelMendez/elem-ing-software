import editIMG from "../../assets/edit-product-btn.png";

const EditProfileButton = ({ onClick }) => {

  return (
    <button name="edit-profile-button" onClick={onClick}>
      <img src={editIMG} />
    </button>
  );

}

export default EditProfileButton;