import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  const [isStarted, setIsStarted] = useState(false);
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { redirectUrl } = useSelector(state => state.app);
  let { loading, info, error } = useSelector(state => state.user);

  useEffect(() => {
    if (!loading && info) {
      setIsStarted(true);
      if (redirectUrl) dispatch(push(redirectUrl));
      else {
        dispatch(push('/dashboard'));
        dispatch(setRedirectUrl(null));
      }
    }
  }, [!loading && info])

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
      <div id="login" className="text-center mb-0">
        <h1>{t('Login.title')}</h1>
        <div className="container fluid" id="signupForm">
          <Form onSubmit={onSubmit}>
            <div className="form-group"></div>
            <div className="form-group">
              {isStarted && error && <Alert variant={'danger'}>{error}</Alert>}
              <Form.Control
                type="email"
                placeholder={t('Login.email')}
                className="mb-3"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
              <Form.Control
                type="password"
                placeholder={t('Login.password')}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
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
      </div>
    </div>
  )
}
