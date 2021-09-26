import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Login from "./components/Login";
import MainView from "./components/MainView";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Route exact path="/" component={MainView}/>
      <Route path="/perfil" component={Profile}/>
      <Route path="/login" component={Login}/>
    </Router>
  );
}

export default App;
