import userIMG from "../../assets/user.png"

const ConsumerInfo = ({ username, email, telephone }) => {

    return (
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
                </div>
            </div>
        </div>
    );
}

export default ConsumerInfo;