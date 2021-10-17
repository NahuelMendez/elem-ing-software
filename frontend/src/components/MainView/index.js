import NavBar from "../Navbar"
import MenuContainer from "../MenuView/MenuContainer";

const MainView = () => {
  const role = localStorage.getItem("role")

  return (
    <div>
      <NavBar />
      {role === "pizzeria" && <MenuContainer />}
    </div>
  )
}

export default MainView