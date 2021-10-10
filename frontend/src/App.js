import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Login from "./components/Login";
import MyMenu from "./components/MyMenu";
import MainView from "./components/MainView";
import Profile from "./components/Profile";
import RegisterView from "./components/Register";
import PizzeriaView from "./components/PizzeriaView/PizzeriaView";

function App() {
  return (
    <Router>
      <Route path="/home" component={MainView}/>
      <Route path="/perfil" component={Profile}/>
      <Route path="/login" component={Login}/>
      <Route path="/menu" component={MyMenu} />
      <Route path="/register" component={RegisterView}/>
      <Route path="/pizzeria/:pizzeriaName" component={PizzeriaView}/>
    </Router>
  );
}

export default App;
