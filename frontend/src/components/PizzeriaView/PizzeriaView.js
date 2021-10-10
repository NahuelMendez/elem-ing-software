import NavBar from "../Navbar";
import PizzeriaInfo from "./PizzeriaInfo";

const PizzeriaView = ({ pizzeriaName }) => {

    return (
       <div>
            <NavBar/>
            <PizzeriaInfo pizzeriaName={pizzeriaName}/>
       </div>
    );

}

export default PizzeriaView;