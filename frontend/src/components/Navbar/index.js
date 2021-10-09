import { useState } from "react"
import { Link } from "react-router-dom"

const NavBar = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const role = localStorage.getItem("role")

  const handleShowProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions)
  }

  const handleDeleteUserInfo = () => {
    localStorage.clear()
  }

  return (
    <div className="bg-principal flex justify-end">
      {showProfileOptions &&
        <div onMouseLeave={handleShowProfileOptions} className="absolute flex flex-col right-0 mt-10 w-40 bg-white rounded-md border-2 border-gray-secundary z-10">
          {role === 'pizzeria' && <Link name="go-to-menu" className="p-2" to="/menu">Editar Menú</Link>}
          <Link onClick={handleDeleteUserInfo} name="logout-button" className="p-2" to="/login">Cerrar sesión</Link>
        </div>
      }
      <form className="flex justify-center w-5/6 items-center">
        <input className="input mr-2 w-2/5" placeholder="Buscar" />
        <button className="" type="submit">Search</button>
      </form>
      <div onClick={handleShowProfileOptions} className="cursor-pointer rounded-full mr-2 h-20 w-20 my-2 flex items-center justify-center border border-black-500">
      </div>
    </div>
  )
}

export default NavBar
