import { Link } from "react-router-dom"
import "./index.css"

const NavBar = () => {
  return (
    <div className="nav">
      <Link to="/menu">Editar Menú</Link>
    </div>
  )
}

export default NavBar