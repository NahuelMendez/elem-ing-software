import { useState } from "react"
import { Link } from "react-router-dom"
import searchIcon from "../../assets/search.png"
import { useHistory } from "react-router-dom";
import api from "../../Api/ApiObject";
import { useDispatch } from "react-redux"
import { setSearchResults } from "../../slices/searchSlice";

const NavBar = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const [toSearch, setToSearch] = useState('')
  const role = localStorage.getItem("role")
  const history = useHistory();
  const dispatch = useDispatch();

  const handleShowProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions)
  }

  const handleDeleteUserInfo = () => {
    localStorage.clear()
  }

  const handleSearch = (event) => {
    event.preventDefault()
    if (toSearch.trim().length !== 0) {
      api.searchPizzeria({ name: toSearch }).then(res => {
        dispatch(setSearchResults(res.data))
      })
      history.push('/busquedas')
    }
  }

  const handleChangeSearch = (event) => {
    setToSearch(event.target.value)
  }


  return (
    <div className="bg-principal flex justify-end">
      {showProfileOptions &&
        <div onMouseLeave={handleShowProfileOptions} className="absolute flex flex-col right-0 mt-10 w-40 bg-white rounded-md border-2 border-gray-secundary z-10">
          {role === 'pizzeria' && <Link name="go-to-menu" className="p-2" to="/menu">Editar Menú</Link>}
          {role !== 'pizzeria' && <Link name="profile-button" className="p-2" to="/profile">Mi Perfil</Link>}
          <Link onClick={handleDeleteUserInfo} name="logout-button" className="p-2" to="/login">Cerrar sesión</Link>
        </div>
      }
      {role !== 'pizzeria' &&
        <form onSubmit={handleSearch} className="flex justify-center w-5/6 items-center">
          <input name="search-input" onChange={handleChangeSearch} className="input w-2/5" placeholder="Buscar" />
          <img onClick={handleSearch} src={searchIcon} className="h-6 w-auto cursor-pointer" alt="search-icon" name="search-action" />
        </form>
      }
      <div onClick={handleShowProfileOptions} className="cursor-pointer rounded-full mr-2 h-20 w-20 my-2 flex items-center justify-center border border-black-500">
      </div>
    </div>
  )
}

export default NavBar
