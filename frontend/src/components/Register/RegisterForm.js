import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import api from '../../Api/ApiObject';

const RegisterForm = ({ role }) => {

  const [data, setData] = useState({
    name: "",
    telephone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory()

  const handleChange = event => {
    const target = event.target
    setData(prevState => ({ ...prevState, [target.name]: target.value }));
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.password === confirmPassword) {
      setError("")
      api.register({...data, rol: role === "consumidor" ? "consumer" : role})
        .then(_ => {
          setData({
            name: "",
            telephone: "",
            email: "",
            address: "",
            password: ""
          })
          setConfirmPassword("")
          history.push("/login");
        })
        .catch(error => {
          setError(error.response.data.error)
        })
    } else {
      setError("Passwords do not match")
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex mt-8 justify-center">
        <h1 className="text-lg font-bold">
          Registrarse en PizzApp como {role}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 w-1/5">
        <div className="w-full">
          <div className="flex flex-col w-full mb-2">
            <label htmlFor="floatingInput">Nombre</label>
            <input
              className="input w-full"
              type="text"
              name="name"
              placeholder="Nombre de usuario"
              value={data.name}
              aria-describedby="validationTooltipUsernamePrepend" required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-2">
            <label htmlFor="floatingInput">Telefono</label>
            <input
              className="input w-full"
              type="text"
              placeholder="Telefono"
              name="telephone"
              value={data.telephone}
              aria-describedby="validationTooltipUsernamePrepend" required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-2">
            <label htmlFor="floatingInput">Email</label>
            <input
              type="email"
              className="input w-full"
              id="floatingInput"
              placeholder="E-mail"
              value={data.email}
              name="email"
              aria-describedby="validationTooltipUsernamePrepend" required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-2">
            <label htmlFor="floatingInput">Direccion</label>
            <input
              type="text"
              className="input w-full"
              id="floatingInput"
              placeholder="Direccion"
              value={data.address}
              name="address"
              aria-describedby="validationTooltipUsernamePrepend" required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-2">
            <label htmlFor="floatingPassword">Contraseña</label>
            <input
              type="password"
              className="input w-full"
              id="floatingPassword"
              placeholder="Contraseña"
              value={data.password}
              name="password"
              aria-describedby="validationTooltipUsernamePrepend" required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="" htmlFor="floatingConfirmPassword">Confirmar contraseña</label>
            <input
              id="floatingConfirmPassword"
              className="input w-full"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              name="confirmPassword"
              aria-describedby="validationTooltipUsernamePrepend" required
              onChange={handleConfirmPasswordChange}
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-4">
          <button
            type="submit"
            className="button-principal"
            name="register-button">
            Registrarse
          </button>
        </div>
        <div className="mt-2">
          <Link to={"/login"}> <p className="text-center text-xs">Ya tienes una cuenta? Inicia sesion aqui</p></Link>
        </div>
        <div>
          {error && <div id="alertReg" className="alert alert-danger" role="alert"> {error} </div>}
        </div>
      </form>
    </div>
  );

}

export default RegisterForm;
