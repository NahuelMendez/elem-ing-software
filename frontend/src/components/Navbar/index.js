import { useState } from "react"
import { Link } from "react-router-dom"
// import user from '../../assets/user.png';

const NavBar = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false)

  const handleShowProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions)
  }

  return (
    <div className="bg-principal flex justify-end">
      {showProfileOptions &&
        <div onMouseLeave={handleShowProfileOptions} className="absolute flex flex-col right-0 mt-10 w-40 bg-white rounded-md border-2 border-gray-secundary z-10">
          <Link name="edit-menu-button" className="p-2" to="/menu">Editar Menú</Link>
          <Link name="logout-button" className="p-2" to="/login">Cerrar sesión</Link>
        </div>
      }
      <div name="circular-thing" onClick={handleShowProfileOptions}  className="cursor-pointer rounded-full h-20 w-20 my-2 flex items-center justify-center border border-black-500">
      </div>
    </div>
  )
}

export default NavBar