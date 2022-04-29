import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Alert, Button } from 'react-bootstrap'

import { signIn } from '../../state/user/user.actions'
import { setRedirectUrl } from '../../state/app/app.reducer'

import './styles.css'

/**
 * Component for Logging in the User
 * @constructor
 */
export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' })
  const [errorMessage, setErrorMsg] = useState("");
  const [show, setShow] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { redirectUrl } = useSelector(state => state.app);
  let { loading, info, error } = useSelector(state => state.user);
  let errorMsg = "";
  const location = useLocation();

  useEffect(() => {
    if (!loading && info) {
      setIsStarted(true);
      if (redirectUrl) {
        dispatch(push(redirectUrl));
      } else if (location.state) {
        dispatch(push(location.state));
      } else {
        dispatch(push('/applet'));
        dispatch(setRedirectUrl(null));
      }
    }
  }, [!loading && info])

  useEffect(() => {
    if (location.state && location.state.reset) {
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 5000)
    }
  }, [location])

  if (isStarted && error) {
    let errorMsg = "";
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!user.email) {
      errorMsg = t('Login.emailErrorMessage');
    } else if (!emailPattern.test(user.email)) {
      errorMsg = t('SignUp.invalidEmailError');
    } else if (!user.password) {
      errorMsg = t('Login.passwordErrorMessage');
    } else {
      errorMsg = t('Login.errorMessage');
    }

    setErrorMsg(errorMsg);
    setIsStarted(false);
  }

  /**
   * Sends the Authentication request to the server.
   * @param body
   */
  const onSubmit = async (event) => {
    setIsStarted(true);
    event.preventDefault()
    dispatch(signIn(user));
  }

  return (
    <div className="demo mp-3 align-self-center w-100">
      <div id="login" className="text-center my-2 px-3">
        <h1>{t('Login.title')}</h1>
        <div className="container fluid" id="signupForm">
          <Form onSubmit={onSubmit}>
            <div className="form-group">
              {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
              <Form.Control
                type="text"
                placeholder={t('Login.email')}
                className="mb-3"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                // required
              />
              <Form.Control
                type="password"
                placeholder={t('Login.password')}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                // required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading
                ? t('Login.logging')
                : t('Login.title')}
            </Button>
          </Form>
          <p className="mt-3">
            {t('Login.accountMessage')}{' '}
            <Link to="/signup">{t('Login.create')}</Link>
          </p>
          <p className="mt-3">
            {t('Login.forgotPassword')}{' '}
            <Link to="/forgotpassword">{t('Login.reset')}</Link>
          </p>
        </div>
        {show && <Alert className="mt-5 mx-auto w-50" variant="success" onClose={() => setShow(false)} dismissible>
          <p>Password reset link is sent to your email.</p>
        </Alert>}
      </div>
    </div>
  )
}
