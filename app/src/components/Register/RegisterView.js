import React, { useState} from "react";
import axios from 'axios';
//import { useHistory } from "react-router-dom";
//import { Link } from 'react-router-dom';

const RegisterForm = () =>{

    const [data, setData] = useState({
        name: "",
        telephone: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    //const history = useHistory()

    const handleChange = name => event => {
        setData(prevState => ({ ...prevState, [name]: event.target.value }));
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    //encapsular la api en un objeto

    const handleSubmit = (event) =>{
        event.preventDefault();
        if (data.password === confirmPassword) {
            setError("")
            axios.post("api/register", data)
            .then( response => {
                setData({
                    name: "",
                    telephone: "",
                    email: "",
                    password: "",
                })
                setConfirmPassword("")
                console.log(response.body)
                //history.push("/login");
            })
            .catch( error => setError(error.response.data.result))
        }else {
            setError("Passwords do not match")
        }
    }

    return (
        <div className = "register-container">
        <form onSubmit={handleSubmit} className="register-form">
                <div className="register-tittle">
                    <h1>
                        Registrarse en PizzApp
                    </h1>
                </div>
                <div className="fields-container">
                <div className="form-floating mb-3">
                <input 
                    className="" 
                    type="text"
                    placeholder="User name"
                    value={data.name}
                    aria-describedby="validationTooltipUsernamePrepend" required
                    onChange={handleChange("name")}
                />
                <label htmlFor="floatingInput" className ="form-label">Name</label>
                </div>
                <div class="form-floating mb-3">
                <input 
                    type="email" 
                    className="form-control" 
                    id="floatingInput"
                    placeholder="E-mail"
                    value={data.email}
                    aria-describedby="validationTooltipUsernamePrepend" required
                    onChange={handleChange("email")}
                />
                <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                <input 
                    type="password" 
                    className="form-control" 
                    id="floatingPassword"
                    placeholder="Password"
                    value={data.password}
                    aria-describedby="validationTooltipUsernamePrepend" required
                    onChange={handleChange("password")}    
                />
                <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-floating mb-3">
                <input 
                    id="floatingConfirmPassword"
                    className="form-control" 
                    type="password" 
                    placeholder="Confirm password"
                    value={confirmPassword}
                    aria-describedby="validationTooltipUsernamePrepend" required
                    onChange={handleConfirmPasswordChange}
                />
                <label htmlFor="floatingConfirmPassword">Confirm password</label>
                </div>
                </div>
                <div className="d-grid gap-2 col-12 mx-auto">
                <button 
                    type="submit" 
                    className="btn btn-info rounded-pill my-4">
                    Register
                </button>
                </div>
                <div>
                {/*<Link to={"/login"}> <p className = "text-center">Do you already have an account? Sign up </p></Link>*/}
                </div>
                <div>
                    {error && <div id= "alertReg" className="alert alert-danger" role="alert"> {error} </div>}
                </div>
            </form>
            </div>
    );

}

export default RegisterForm;