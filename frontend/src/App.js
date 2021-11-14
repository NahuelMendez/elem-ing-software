import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Login from "./components/Login";
import MyMenu from "./components/MyMenu";
import MainView from "./components/MainView";
import Profile from "./components/Profile";
import RegisterView from "./components/Register";
import SearchResult from "./components/SearchResult";
import PizzeriaView from "./components/PizzeriaView/PizzeriaView";
import PizzeriaOrders from "./components/PizzeriaView/PizzeriaOrders";

function App() {
  return (
    <Router>
      <Route path="/home" component={MainView} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/menu" component={MyMenu} />
      <Route path="/register" component={RegisterView} />
      <Route path="/search" component={SearchResult} />
      <Route path="/pizzeria/:pizzeriaName" component={PizzeriaView} />
      <Route path="/order" component={PizzeriaOrders} />
    </Router>
  );
}

export default App;
