import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { signUpSuccessful } from '../../state/user/user.thunks'
import { signUp } from '../../services/authentication.service'
import { getPrivateKey } from '../../services/encryption'
import { Statuses } from '../../constants'
import './styles.css'

export default function SignUp() {
  const [status, setStatus] = useState(Statuses.READY)
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  /**
   * Sends the New User details to the server for Creating User.
   *
   * If the given password is not validated or username or email already present, it will display an error message.
   * @param body
   * @returns {Promise} resolves when the signup is successful.
   */
  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus(Statuses.LOADING)
    const { confirmPassword, ...rest } = user
    try {
      const response = await signUp(rest)
      const privateKey = getPrivateKey({
        userId: response._id,
        email: user.email,
        password: user.password
      })
      setStatus(Statuses.READY)
      dispatch(signUpSuccessful({ ...response, privateKey, email: user.email }))
    } catch ({ message }) {
      setError(message)
      setStatus(Statuses.READY)
    }
  }

  const isPasswordSame = user.password === user.confirmPassword

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <h1>{t('SignUp.title')}</h1>
        <div className="container fluid" id="signupForm">
          <Form onSubmit={onSubmit}>
            <div className="form-group">
              {error && <Alert variant={'danger'}>{error}</Alert>}
              <Form.Control
                name="user"
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

              {!isPasswordSame && (
                <Alert variant={'danger'}>
                  {t('SignUp.passwordsUnmatched')}
                </Alert>
              )}
            </div>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={status === Statuses.LOADING || !isPasswordSame}
            >
              {status === Statuses.READY
                ? t('SignUp.title')
                : t('SignUp.signingIn')}
            </Button>
          </Form>
          <p> {t('SignUp.account')} <Link to="/login"> {t('SignUp.logIn')}</Link></p>
        </div>
      </div>
    </div>
  )
}
