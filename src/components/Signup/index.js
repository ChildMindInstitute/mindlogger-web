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
  const [isStarted, setIsStarted] = useState(false);
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const { redirectUrl } = useSelector(state => state.app);
  let { loading, info, error } = useSelector(state => state.user);

  const isRouted = location.pathname.includes('signup');

  useEffect(() => {
    if (!loading && info) {
      setIsStarted(true);
      if (redirectUrl) dispatch(push(redirectUrl));
      else {
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
    setIsStarted(true);
    event.preventDefault();
    const { confirmPassword, ...rest } = user

    if (isPasswordSame) {
      dispatch(signUp(rest));
    }
  }

  const isPasswordSame = user.password === user.confirmPassword

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        {isRouted && <h1>{t('SignUp.title')}</h1>}
        <div className="container fluid" id="signupForm">
          <Form onSubmit={onSubmit}>
            <div className="form-group">
              {isStarted && error && (
                <Alert variant={'danger'}>
                  {user.password.length < 6
                    ? t('SignUp.passwordErrorMessage')
                    : t('SignUp.signUpError')
                }
                </Alert>
              )}
              <Form.Control
                name="user"
                type="email"
                placeholder={t('SignUp.email')}
                className="mb-3"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
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

              {!isPasswordSame && (
                <Alert variant={'danger'}>
                  {t('SignUp.passwordsUnmatched')}
                </Alert>
              )}
            </div>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
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
