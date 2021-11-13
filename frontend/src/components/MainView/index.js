import NavBar from "../Navbar"
import MenuContainer from "../MenuView/MenuContainer";
import Ranking from "../Ranking";

const MainView = () => {
  const role = localStorage.getItem("role")

  return (
    <div>
      <NavBar />
      {role === "pizzeria" ? <MenuContainer /> : <Ranking />}
    </div>
  )
}

export default MainView