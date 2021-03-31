import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'

import { signInSuccessful } from '../../state/user/user.thunks'
import { getPrivateKey } from '../../services/encryption'
import { signIn } from '../../services/authentication.service'
import { Statuses } from '../../constants'
import './styles.css'

/**
 * Component for Logging in the User
 * @constructor
 */
export default function Login () {
  const [status, setStatus] = useState(Statuses.READY)
  const [user, setUser] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  /**
   * Sends the Authentication request to the server.
   *
   * If the given password or username is incorrect, it will display an error message.
   * @param body
   * @returns {Promise} resolves when the authentication is successful.
   */
  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus(Statuses.LOADING)
    try {
      const response = await signIn(user)
      const privateKey = getPrivateKey({
        userId: response.user._id,
        email: user.email,
        password: user.password
      })
      setStatus(Statuses.READY)
      dispatch(
        signInSuccessful({
          ...response,
          user: { ...response.user, privateKey, email: user.email }
        })
      )
    } catch ({ message }) {
      setError(message)
      setStatus(Statuses.READY)
    }
  }

  return (
    <div className="demo mp-3 align-self-center w-100">
      <div id="login" className="text-center mb-0">
        <h1>{t('Login.title')}</h1>
        <div className="container fluid" id="signupForm">
          <Form onSubmit={onSubmit}>
            <div className="form-group"></div>
            <div className="form-group">
              {error && <Alert variant={'danger'}>{error}</Alert>}
              <Form.Control
                type="email"
                placeholder={t('Login.email')}
                className="mb-3"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <Form.Control
                type="password"
                placeholder={t('Login.password')}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={status === Statuses.LOADING}
            >
              {status === Statuses.READY
                ? t('Login.title')
                : t('Login.logging')}
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
