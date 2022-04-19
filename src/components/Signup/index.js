import React, { useState, useEffect } from 'react'
import { push } from 'connected-react-router'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { signUp } from '../../state/user/user.actions'
import { setRedirectUrl } from '../../state/app/app.reducer'

import './styles.css'

export default () => {
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [errorMessage, setErrorMsg] = useState("");
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const { redirectUrl } = useSelector(state => state.app);
  const isRouted = location.pathname.includes('signup');
  let { loading, info } = useSelector(state => state.user);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    if (!loading && info) {
      if (redirectUrl) {
        dispatch(push(redirectUrl));
      } else if (location.state) {
        dispatch(push(location.state));
     } else {
        dispatch(push('/profile'));
        dispatch(setRedirectUrl(null));
      }
    }
  }, [!loading && info])

  /**
   * Sends the New User details to the server for Creating User.
   * @param body
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    const { confirmPassword, ...rest } = user

    if (rest.password.length < 6) {
      setErrorMsg("Password should be at least 6 characters");
      return;
    } else if (rest.password.includes(" ")) {
      setErrorMsg("Password should not contain blank spaces");
      return;
    }

    if (isPasswordSame) {
      const response = await dispatch(signUp(rest));
      if (response.error) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!user.email) {
          setErrorMsg(t('SignUp.emailErrorMessage'));
        } else if (!emailPattern.test(user.email)) {
          setErrorMsg(t('SignUp.invalidEmailError'));
        } else if (!user.firstName) {
          setErrorMsg(t('SignUp.firstNameRequiredError'));
        } else if (!user.password) {
          setErrorMsg(t('SignUp.passwordErrorMessage'));
        } else if (user.password !== user.confirmPassword) {
          setErrorMsg(t('SignUp.passwordsUnmatched'));
        } else if (user.password.length < 6) {
          setErrorMsg(t('SignUp.passwordLengthError'));
        } else if (response.error.message.includes("already registered")) {
          setErrorMsg(t('SignUp.existingEmailError'));
        }
      } else {
        setErrorMsg("");
      }
    } else {
      setErrorMsg("Confirm password doesn't match");
      return;
    }
  }

  const isPasswordSame = user.password === user.confirmPassword

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center my-2">
        {isRouted && <h1>{t('SignUp.title')}</h1>}
        <div className="container fluid" id="signupForm">
          <Form onSubmit={onSubmit}>
            <div className="form-group">
              {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}
              <Form.Control
                name="user"
                type="text"
                placeholder={t('SignUp.email')}
                className="mb-3"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <Form.Control
                type="text "
                name="firstName"
                placeholder={t('SignUp.firstName')}
                className="mb-3"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
              <Form.Control
                type="text"
                name="lastName "
                placeholder={t('SignUp.lastName')}
                className="mb-3"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />

              <Form.Control
                type="password"
                name="password"
                placeholder={t('SignUp.password')}
                className="mb-3"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder={t('SignUp.confirmPassword')}
                className="mb-3"
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
              />

              <div className="d-flex">
                <Form.Check
                  type="checkbox"
                  value={terms}
                  id="terms_id"
                  onChange={() => setTerms(!terms)}
                />
                <Form.Label for="terms_id">I agree to the <a href="https://mindlogger.org/terms" target='_blank'>Terms of Service</a></Form.Label>
              </div>
            </div>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !terms}
            >
              {loading
                ? t('SignUp.signingIn')
                : t('SignUp.title')}
            </Button>
          </Form>
          {isRouted && (
            <p className="my-3">
              {' '}
              {t('SignUp.account')}{' '}
              <Link to="/login"> {t('SignUp.logIn')}</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
