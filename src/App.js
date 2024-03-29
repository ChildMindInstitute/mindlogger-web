import React from 'react';
import { Container } from 'react-bootstrap';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { history } from './store';
import { userInfoSelector } from './state/user/user.selectors';

import Footer from './components/Base/Footer'
import NavBar from './components/Base/Navbar'
import Login from './components/Login'
import SignUp from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import Profile from './components/Profile'
import ChangePassword from './components/ChangePassword'
import Landing from './components/Landing'
import AppletList from './components/AppletList'
import Invitation from './components/Invitation/Invitation'
import AcceptInvitation from './components/Invitation/AcceptInvitation'
import DeclineInvitation from './components/Invitation/DeclineInvitation'
import ActivityList from './components/ActivityList'
import SetPassword from './components/Setpassword'
import { Consent } from './components/Consent/index'
import Screens from './components/Screens'
import PublicApplet from './components/PublicApplet';
import { Join } from './components/Invitation/Join';
import ActivityThanks from './components/ActivityThanks';

import './App.css';

/**
 * Main Component of the Application - Routes to specific components based on the Path.
 */
const App = () => {
  const user = useSelector(userInfoSelector);

  return (
    <ConnectedRouter history={history}>
      <NavBar user={user} />
      <div className={'main-container'}>
        <div style={{ justifyContent: 'center', margin: 'unset' }} className={'app-container'}>
          <Switch>
            <Route path="/applet/public/:publicId" exact component={PublicApplet} />
            <Route path="/applet/public/:appletId/activity/:activityId" exact component={Screens} />

            <Route path="/applet/:appletId/activity_thanks" exact component={ActivityThanks}/>
            {user ? ( <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/login" exact component={Login} />
                <Route path="/signup" exact component={SignUp} />
                <Route path="/forgotpassword" exact component={ForgotPassword} />
                <Route path="/changepassword" exact component={ChangePassword} />
                <Route path="/profile" exact component={Profile} />
                <Route path="/dashboard" exact component={Landing} />
                <Route path="/applet" exact component={AppletList} />
                <Route path="/invitation/:invitationId" exact component={Invitation} />
                <Route path="/invitation/:invitationId/accept" exact component={AcceptInvitation} />
                <Route path="/invitation/:invitationId/decline" exact component={DeclineInvitation} />
                <Route path="/useraccount/:userId/token/:temporaryToken" exact component={SetPassword} />
                <Route path="/consent/:inviteURL" exact component={Consent} />
                <Route path="/applet/:appletId/activity/:activityId" exact component={Screens} />
                <Route path="/applet/:appletId/dashboard" exact component={ActivityList} />
                <Route path="/join/:inviteLinkId" exact component={Join} />
                <Route path="*" render={() => <Redirect to="/" />} />
              </Switch>
            ) : (
              <Switch>
                <Route path="/login" exact component={Login} />
                <Route path="/signup" exact component={SignUp} />
                <Route path="/forgotpassword" exact component={ForgotPassword} />
                <Route path="/useraccount/:userId/token/:temporaryToken" exact component={SetPassword} />
                <Route path="/invitation/:invitationId" exact component={Invitation} />
                <Route path="/invitation/:invitationId/accept" exact component={AcceptInvitation} />
                <Route path="/invitation/:invitationId/decline" exact component={DeclineInvitation} />
                <Route path="/dashboard" exact component={Landing} />
                <Route path="/" exact component={Landing} />
                <Route path="/join/:inviteLinkId" exact component={Join} />
                <Route path="*" render={() => <Redirect to="/" />} />
              </Switch>
            )}
          </Switch>
        </div>
      </div>
      <Footer />
    </ConnectedRouter>
  );
};

export default App;
