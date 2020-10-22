import React from 'react';
import { Container } from 'react-bootstrap'
import { ConnectedRouter } from 'connected-react-router'
import {Switch, Route} from 'react-router-dom';

import {useSelector} from "react-redux";
import { history } from './store'
import {userInfoSelector} from "./state/user/user.selectors";

import NavBar from './components/NavBar';
import Login from './components/Login';
import SignUp from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import Landing from "./components/Landing";

import './App.css';


/**
 * Main Component of the Application - Routes to specific components based on the Path.
 */
function App() {
  const user = useSelector(userInfoSelector);

  return (
    <>
      <NavBar user={user} />
      <Container className={'main-container'}>
        <Container style={{justifyContent: 'center', margin: 'unset'}} className={'app-container'}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/login" exact component={ Login} />
              <Route path="/signup" exact component={ SignUp} />
              <Route path="/forgotpassword" exact component={ ForgotPassword} />
              <Route path="/changepassword" exact component={ ChangePassword} />
              <Route path="/profile" exact component={ Profile} />
              <Route path="/dashboard" exact component={ Landing} />
            </Switch>
          </ConnectedRouter>
        </Container>
      </Container>`
    </>
  );
}
export default App;
