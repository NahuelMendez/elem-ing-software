import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import searchIcon from "../../assets/search.png"
import { useHistory } from "react-router-dom";
import api from "../../Api/ApiObject";
import { useDispatch, useSelector } from "react-redux"
import { setSearchResults } from "../../slices/searchSlice";
import userIMG from "../../assets/user.png";
import homeIcon from "../../assets/home-icon.png"
import { consumerInfoState, setConsumerInfo } from "../../slices/consumerSlice";

const NavBar = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [toSearch, setToSearch] = useState('');
  const role = localStorage.getItem("role");
  const history = useHistory();
  const dispatch = useDispatch();
  const { image } = useSelector(consumerInfoState);
  const hasProfilePicture = image !== ''

  useEffect(() => {
    getConsumer();
  }, []);

  const getConsumer = () => {
    api.getConsumer()
      .then(response => {
        dispatch(setConsumerInfo(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  }

  const handleShowProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions);
  }

  const handleDeleteUserInfo = () => {
    localStorage.clear();
  }

  const handleSearch = (event) => {
    event.preventDefault()
    if (toSearch.trim().length !== 0) {
      api.searchPizzeria({ name: toSearch }).then(res => {
        dispatch(setSearchResults({
          searchText: toSearch,
          results: res.data
        }))
      })
      history.push('/busquedas')
    }
  }

  const handleChangeSearch = (event) => {
    setToSearch(event.target.value)
  }


  return (
    <div className="navBar bg-principal flex justify-between">
      <div>
        <a href="/home">
          <img src={homeIcon} name="goto-home-button" />
        </a>
      </div>
      {showProfileOptions &&
        <div onMouseLeave={handleShowProfileOptions} className="absolute flex flex-col right-0 mt-10 w-40 bg-white rounded-md border-2 border-gray-secundary z-10">
          {role === 'pizzeria' ?
            <>
              <Link name="go-to-menu" className="p-2" to="/menu">Agregar producto</Link>
              <Link name="go-to-orders" className="p-2" to="/order">Pedidos</Link>
            </> :
            <Link name="profile-button" className="p-2 profile-button" to="/profile">Mi Perfil</Link>
          }
          <Link onClick={handleDeleteUserInfo} name="logout-button" className="p-2" to="/login">Cerrar sesión</Link>
        </div>
      }
      {role !== 'pizzeria' &&
        <form onSubmit={handleSearch} className="flex justify-center w-5/6 items-center">
          <input name="search-input" onChange={handleChangeSearch} className="input w-2/5" placeholder="Buscar" />
          <img onClick={handleSearch} src={searchIcon} className="h-6 w-auto cursor-pointer" alt="search-icon" name="search-action" />
        </form>
      }
      <div onClick={handleShowProfileOptions} className="cursor-pointer rounded-full mr-2 h-20 w-20 my-2 flex items-center justify-center border border-gray-500">
        <img className="rounded-full h-20 w-20 border border-black-500" src={hasProfilePicture ? image : userIMG} />
      </div>
    </div>
  )
}

export default NavBar
