import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'

import { signInSuccessful } from '../../state/user/user.thunks'
import { signIn } from '../../services/network'
import { getPrivateKey } from '../../services/encryption'

import './styles.css'

/**
 * Component for Logging in the User
 * @constructor
 */
export default function Login() {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, errors } = useForm()
  const { alert, setAlert } = useState(true)
  const dispatch = useDispatch()

  /**
   * Sends the Authentication request to the server.
   *
   * If the given password or username is incorrect, it will display an error message.
   * @param body
   * @returns {Promise} resolves when the authentication is successful.
   */
  const onSubmit = (body) => {
    return signIn({ ...body })
      .then((response) => {
        if (typeof response.exception !== 'undefined') {
          throw response.exception
        } else {
          response.user.privateKey = getPrivateKey({
            userId: response.user._id,
            email: body.user,
            password: body.password
          })
          response.user.email = body.user
          dispatch(signInSuccessful(response))
        }
      })
      .catch((e) => {
        if (typeof e.status !== 'undefined') {
          setError('password', {
            type: 'manual',
            message: t('Login.errorMessage')
          })
        } else {
          setError('password', {
            type: 'manual',
            message: t('Login.errorMessage')
          })
        }
      })
  }

  return (
    <div className="demo mp-3 align-self-center w-100">
      <div id="login" className="text-center mb-0">
        <h1>{t('Login.title')}</h1>
        <div className="container fluid" id="signupForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              {/* <input
                name="user"
                placeholder={t('Login.email')}
                className="form-control"
                ref={register({
                  required: t('Login.emailRequiredError'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('Login.emailErrorMessage')
                  }
                })}
              /> */}
              {errors.email && errors.email.message}
            </div>
            <div className="form-group">
              {/* <input
                name="password"
                type="password"
                placeholder={t('Login.password')}
                className="form-control"
                ref={register({
                  required: t('Login.passwordRequiredError'),
                  minLength: {
                    value: 6,
                    message: t('Login.passwordErrorMessage')
                  }
                })}
              /> */}
              <Alert variant={color}>This is a alert—check it out!</Alert>
              <Form>
                <Form.Control
                  name="user"
                  type="email"
                  placeholder={t('Login.email')}
                  className="mb-3"
                  ref={register({
                    required: t('Login.emailRequiredError'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('Login.emailErrorMessage')
                    }
                  })}
                />
                <Form.Control
                  type="password"
                  name="password"
                  placeholder={t('Login.password')}
                  ref={register({
                    required: t('Login.passwordRequiredError'),
                    minLength: {
                      value: 6,
                      message: t('Login.passwordErrorMessage')
                    }
                  })}
                />
              </Form>
            </div>
            {errors.password && errors.password.message}
            {/* <button type="submit" className="btn btn-primary">
              {t('Login.submit')}
            </button> */}
            <Button type="submit" variant="primary">
              {' '}
              {t('Login.title')}
            </Button>
          </form>
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
