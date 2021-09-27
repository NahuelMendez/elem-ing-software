import React, {useState} from "react";
import api from '../Api/ApiObject';
import {Link} from 'react-router-dom';

const Login = () => {

  const [data, setData] = useState({email: "", password: ""});
  const [error, setError] = useState("");

  const handleChange = name => event => {
    setData(prevState => ({ ...prevState, [name]: event.target.value }));
  }

  const handleSubmit = (event) =>{
    event.preventDefault()
    
  }

  return (
    <div className = "border border-secondary rounded p-4 m-4 h-100">
        <form onSubmit={handleSubmit}>
        <h1 className = "mb-4 text-center">
            Iniciar Sesion en PizzApp
        </h1>
        <div className="form-floating mb-3">
          <label htmlFor="floatingInput">Email</label>
            <input
            type="email"
            id="floatingInput"
            className="form-control"
            placeholder="name@example.com"
            value={data.email}
            aria-describedby="validationTooltipPrependEmail" required
            onChange={handleChange("email")}
            />
        </div>
        <div className="form-floating">
          <label htmlFor="password">Contraseña</label>
            <input
            type="password"
            className="form-control"
            id="floatingPasword"
            placeholder="Contraseña"
            value={data.password}
            aria-describedby="validationTooltipPrependPass" required
            onChange={handleChange("password")}
            />
        </div>
        <div className="d-grid gap-2 col-12 mx-auto">
        <button type="submit" className="btn btn-info rounded-pill my-4">
            Iniciar Sesion
        </button>
        </div>
        <div>
            {error && <div id= "alertReg" className="alert alert-danger" role="alert"> 
                El email y/o la contraseña no son correctos. Por favor reviselos e intente nuevamente.
            </div>}
        </div>
        <Link to={"/register"}> <p className = "text-center">No tienes una cuenta? Registrate en PizzApp</p> </Link>
        </form>
  </div>
  )
}

export default Login