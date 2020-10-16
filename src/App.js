import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from 'react-bootstrap'
import NavBar from './components/NavBar';
import Login from './components/Login';
import {useSelector} from "react-redux";
import {userInfoSelector} from "./state/user/user.selectors";
import { ConnectedRouter } from 'connected-react-router'
import { history } from './store'
import {Switch, Route} from 'react-router-dom';
import SignUp from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import Landing from "./components/Landing";
function App() {
    const user = useSelector(userInfoSelector)
    return (
        <React.Fragment>
        <NavBar user={user} />
        <Container className={'main-container'}>
            <Container style={{justifyContent: 'center', margin: 'unset'}} className={'app-container'}>
                <ConnectedRouter history={history}>
                    <Switch>
                        {/*<Route path="/"  exact component={Home} />*/}
                        <Route path="/login" exact component={ Login} />
                        <Route path="/signup" exact component={ SignUp} />
                        <Route path="/forgotpassword" exact component={ ForgotPassword} />
                        <Route path="/changepassword" exact component={ ChangePassword} />
                        <Route path="/profile" exact component={ Profile} />
                        <Route path="/dashboard" exact component={ Landing} />
                        {/*<Route path="/register" exact component={Register} />*/}
                        {/*<PrivateRoute path="/dashboard" exact component={Dashboard} />*/}
                        {/*<PrivateRoute path="/profile" exact component={Profile} />*/}
                    </Switch>
                </ConnectedRouter>
            </Container>
        </Container>`
        </React.Fragment>
    );
}
export default App;
