import NavBar from "../Navbar";
import PizzeriaInfo from "./PizzeriaInfo";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../../Api/ApiObject";
import ViewProducts from "../Product/ViewProducts";
import Notebook from "../Notebook";

const PizzeriaView = () => {

  const [menu, setMenu] = useState([]);
  const { pizzeriaName } = useParams();

  useEffect(() => {
    getMenu()
  }, []);

  const getMenu = () => {
    api.getMenu(pizzeriaName)
      .then(response => setMenu(response.data))
      .catch(err => console.log(err));
  }

  return (
    <div className="pb-4">
      <NavBar />
      <PizzeriaInfo pizzeriaName={pizzeriaName} />
      <div className="piz-info-container">
        <div />
        {menu.length === 0 ?
          <h3 name="not-found-products" className="text-center mt-8">No se ingresaron productos en el menú</h3> :
          <ViewProducts products={menu} editMode={false} />
        }
        <Notebook />
      </div>
    </div>
  );

}

export default PizzeriaView;