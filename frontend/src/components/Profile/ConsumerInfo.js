import { useState } from "react";
import userIMG from "../../assets/user.png"
import EditProfileButton from "../Profile/EditProfileButton"
import Modal from "../Modal";
import EditProfileForm from "./EditProfileForm";
import api from "../../Api/ApiObject";

const ConsumerInfo = ({ username, email, telephone }) => {

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
            <div className="cmr-info-container">
                <div className="cmr-info-body-container">
                    <div className="cmr-info-body">
                        <div className="cmr-info-image">
                            <img src={userIMG}></img>
                        </div>
                        <div className="cmr-info-dtl">
                            <ul>
                                <li className="mb-3" name="consumer-name"><b>Nombre:</b> {username}</li>
                                <li className="mb-3" name="consumer-telephone"><b>Telefono:</b> {telephone}</li>
                                <li className="mb-3" name="consumer-email"><b>Email:</b> {email}</li>
                            </ul>
                        </div>
                            <EditProfileButton onClick={() => setShowEditForm(true)}/>
                        </div>
                    </div>
                </div>
                { showEditForm &&
                    <Modal handleClose={() => setShowEditForm(false)}
                        title={"Editar Perfil"}
                        body={
                            <EditProfileForm 
                                username={username}
                                email={email}
                                telephone={telephone}
                                handleSubmit={handleSubmit}/>
                        } />
                }
        </>
    );
}

export default ConsumerInfo;