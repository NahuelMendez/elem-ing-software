import NavBar from "../Navbar"
import MenuContainer from "../MenuView/MenuContainer";
import Notebook from "../Notebook";

const MainView = () => {
  const role = localStorage.getItem("role")

  return (
    <div>
      <NavBar />
      <div className=" w-full flex flex-col items-end">
        <Notebook pizzeriaName={'pizzeriaB'}/>
      </div>
      {role === "pizzeria" && <MenuContainer />}
    </div>
  )
}

export default MainView