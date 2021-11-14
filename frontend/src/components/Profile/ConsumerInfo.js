import { useState } from "react";
import userIMG from "../../assets/user.png"
import EditProfileButton from "../Profile/EditProfileButton"
import Modal from "../Modal";
import EditProfileForm from "./EditProfileForm";
import api from "../../Api/ApiObject";

const ConsumerInfo = ({ username, email, telephone, address, profilePicture }) => {

  const [showEditForm, setShowEditForm] = useState(false);

  const handleSubmit = (editedProfile) => {
    return api.updateConsumer(editedProfile)
      .then((res) => {
        const role = res.data.rol
        const username = res.data.username
        localStorage.setItem("role", role)
        localStorage.setItem("username", username)
        localStorage.setItem("token", res.headers.authorization)
        window.location.reload()
      })
  }

  return (
    <>
      <div className="flex flex-column items-center w-1/4 border border-color-gray-500 rounded-md mt-8 h-screen">
        <div className="w-full flex justify-end pt-2 pr-2">
          <EditProfileButton onClick={() => setShowEditForm(true)} />
        </div>
        <div className="w-11/12">
          <div className="flex justify-center p-4">
            <img className="rounded-full h-28 w-28 border border-black-500" src={profilePicture ? profilePicture : userIMG} />
          </div>
          <div className="cmr-info-dtl flex flex-col items-center">
            <ul className="p-0">
              <li className="mb-3" name="consumer-name"><b>Nombre:</b> {username}</li>
              <li className="mb-3" name="consumer-telephone"><b>Telefono:</b> {telephone}</li>
              <li className="mb-3" name="consumer-email"><b>Email:</b> {email}</li>
              <li className="mb-3" name="consumer-address"><b>Direccion:</b> {address}</li>
            </ul>
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
              address={address}
              profilePicture={profilePicture}
              handleSubmit={handleSubmit} />
          }
        />
      }
    </>
  );
}

export default ConsumerInfo;