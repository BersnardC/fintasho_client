import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Purchase from './components/Purchase';

function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <div className="hero">
          <nav>
            <img src="https://media-exp1.licdn.com/dms/image/C4E03AQG6a0Pw6iyJnA/profile-displayphoto-shrink_200_200/0/1541457400725?e=1637798400&v=beta&t=LfsO6VmLjeFuv8fGf95cZGR62pvkPsiO_mWwv1938AM" alt="" className="logo" />
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><a href="https://www.linkedin.com/in/bersnardcoello/" target="_blank">Sobre mi</a></li>
              <li><a href="https://github.com/BersnardC/tailadmin" target="_blank"><span className="fab fa-github"></span></a></li>
            </ul>
          </nav>
        </div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/home" exact>
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/confirm/:id">
            <Purchase />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
