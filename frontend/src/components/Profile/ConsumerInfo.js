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
                            <li>{username}</li>
                            <li>{telephone}</li>
                            <li>{email}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConsumerInfo;