import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Login from "./components/Login";
import MainView from "./components/MainView";
import MyMenu from "./components/MyMenu";
import Profile from "./components/Profile";

function App() {
  return (
      <Router>
        <Route exact path="/" component={MainView} />
        <Route exact path="/perfil" component={Profile} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/menu" component={MyMenu} />
      </Router>
  );
}

export default App;
