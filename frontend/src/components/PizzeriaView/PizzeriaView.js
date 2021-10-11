import NavBar from "../Navbar";
import PizzeriaInfo from "./PizzeriaInfo";
import { useParams } from "react-router";

const PizzeriaView = () => {

  const { pizzeriaName } = useParams();

  return (
    <div>
      <NavBar />
      <PizzeriaInfo pizzeriaName={pizzeriaName} />
    </div>
  );

}

export default PizzeriaView;