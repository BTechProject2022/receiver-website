import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./util/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

//import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/layout/Register";
import Login from "./components/layout/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/layout/Dashboard";
import CreateDid from "./components/layout/CreateDid";
import CredentialList from "./components/layout/CredentialList";
import Verification from "./components/layout/Verfication";

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Route path="/" component={Landing} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/login" component={Login} exact />
        <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/createDid" component={CreateDid} />
          <PrivateRoute exact path="/credentials" component={CredentialList} />
          <PrivateRoute exact path="/verification" component={Verification} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
