import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Login from "./components/Login";
import MyMenu from "./components/MyMenu";
import MainView from "./components/MainView";
import Profile from "./components/Profile";
import RegisterView from "./components/Register/RegisterView";

function App() {
  return (
    <Router>
      <Route path="/home" component={MainView}/>
      <Route exact path="/" component={Login}/>
      <Route exact path="/login" component={Login}/>
      <Route path="/perfil" component={Profile}/>
      <Route path="/menu" component={MyMenu} />
      <Route path="/register" component={RegisterView}/>
    </Router>
  );
}

export default App;
