import { Link } from "react-router-dom"
import imgGeneric from "../../assets/generic-img.jpg"

const PizzeriaCard = ({ name }) => {

  return (
    <Link to={"/pizzeria/" + name} style={{color: "black", textDecoration: "none"}} className="card w-1/6">
      <div className="w-full">
        <img src={imgGeneric} alt="" className="pizzeria-img"></img>
      </div>
      <div className="card-body">
        <h2 className="card-tittle">{name}</h2>
      </div>
    </Link>
  )
}

export default PizzeriaCard