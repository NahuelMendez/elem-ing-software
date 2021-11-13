import { useState } from "react";
import userIMG from "../../assets/user.png"
import EditProfileButton from "../Profile/EditProfileButton"
import Modal from "../Modal";
import EditProfileForm from "./EditProfileForm";
import api from "../../Api/ApiObject";
import { useDispatch } from "react-redux";
import { setConsumerInfo } from "../../slices/consumerSlice";

const ConsumerInfo = ({ username, email, telephone, profilePicture }) => {

  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (editedProfile) => {
    return api.updateConsumer(editedProfile)
      .then((res) => {
        const role = res.data.rol
        const username = res.data.username
        localStorage.setItem("role", role)
        localStorage.setItem("username", username)
        localStorage.setItem("token", res.headers.authorization)
        dispatch(setConsumerInfo({ username: editedProfile.name, ...editedProfile }))
        setShowEditForm(false)
      })
  }

  return (
    <>
      <div className="cmr-info-container">
        <div className="cmr-info-body-container">
          <div className="cmr-info-body">
            <div className="flex justify-center p-4 cmr-info-image">
              <img className="rounded-full h-20 w-20 border border-black-500" src={profilePicture ? profilePicture : userIMG} />
            </div>
            <div className="cmr-info-dtl">
              <ul>
                <li className="mb-3" name="consumer-name"><b>Nombre:</b> {username}</li>
                <li className="mb-3" name="consumer-telephone"><b>Telefono:</b> {telephone}</li>
                <li className="mb-3" name="consumer-email"><b>Email:</b> {email}</li>
              </ul>
            </div>
            <EditProfileButton onClick={() => setShowEditForm(true)} />
          </div>
        </div>
      </div>
      {showEditForm &&
        <Modal handleClose={() => setShowEditForm(false)}
          title={"Editar Perfil"}
          body={
            <EditProfileForm
              username={username}
              email={email}
              telephone={telephone}
              profilePicture={profilePicture}
              handleSubmit={handleSubmit} />
          } />
      }
    </>
  );
}

export default ConsumerInfo;