import React, { useState } from "react";
import api from '../../Api/ApiObject';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const Login = () => {

  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const history = useHistory();

  const handleChange = name => event => {
    setData(prevState => ({ ...prevState, [name]: event.target.value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    api.login(data)
      .then(_ => history.push('/home'))
      .catch(err => setError(err.response.data.error));
  }

  return (
    <div className="w-full mt-8 flex flex-col justify-center items-center">
      <h1 className="mb-4 text-center text-lg font-bold">
        Iniciar Sesion en PizzApp
      </h1>
      <form onSubmit={handleSubmit} className="w-1/5">
        <div className="flex w-full flex-col mb-3">
          <label className="mb-2" htmlFor="floatingInput">Nombre de usuario</label>
          <input
            type="text"
            id="floatingInput"
            className="input w-full"
            placeholder="Nombre de Usuario"
            value={data.username}
            aria-describedby="validationTooltipPrepend" required
            onChange={handleChange("username")}
          />
        </div>
        <div className="flex w-full flex-col mb-3">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="input w-full"
            id="floatingPasword"
            placeholder="Contraseña"
            value={data.password}
            aria-describedby="validationTooltipPrependPass" required
            onChange={handleChange("password")}
          />
        </div>
        <div className="w-full flex justify-center mt-4">
          <button type="submit" className="button-principal">
            Iniciar Sesion
          </button>
        </div>
        <div>
          {error && <div id="alertReg" className="alert alert-danger" role="alert">
            El nombre de usuario y/o la contraseña no son correctos. Por favor reviselos e intente nuevamente.
          </div>}
        </div>
        <Link to={"/register"}> <p className="text-center text-xs mt-4">No tienes una cuenta? Registrate en PizzApp</p> </Link>
      </form>
    </div>
  )
}

export default Login