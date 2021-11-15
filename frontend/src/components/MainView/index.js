import NavBar from "../Navbar"
import MenuContainer from "../MenuView/MenuContainer";
import Ranking from "../Ranking";
import { useEffect } from "react";
import { useHistory } from "react-router";

const MainView = () => {
  const role = localStorage.getItem("role")
  const loggedIn = localStorage.getItem('token') !== null
  const history = useHistory()
  
  useEffect(() => {
    if(!loggedIn){
      history.push('/login')
    }
  }, [])

  return (
    <div>
      <NavBar />
      {role === "pizzeria" ? <MenuContainer /> : <Ranking />}
    </div>
  )
}

export default MainView