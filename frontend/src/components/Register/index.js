import React, { useState } from "react";
import RegisterForm from "./RegisterForm";

const RegisterLayout = () => {
  const [showForm, setShowForm] = useState({ show: false, role: '' })

  const handleShowForm = (role) => {
    setShowForm({ show: true, role })
  }

  return !showForm.show ? (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/4 pt-2 px-4 h-2/4 flex flex-col items-center">
        <p className="text-xl font-medium">¿Cómo queres registrarte?</p>
        <div className="w-full items-center h-2/3 flex justify-between">
          <button onClick={() => handleShowForm('pizzeria')} className="button-principal">Como pizzeria</button>
          <button onClick={() => handleShowForm('consumidor')} className="button-principal">Como consumidor</button>
        </div>
      </div>
    </div>
  ) :
    <RegisterForm role={showForm.role}/>
}

export default RegisterLayout