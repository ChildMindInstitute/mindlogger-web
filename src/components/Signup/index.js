import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { signUpSuccessful } from '../../state/user/user.thunks'
import { signUp } from '../../services/network'
import { getPrivateKey } from '../../services/encryption'

import './styles.css'

export default function SignUp() {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, errors } = useForm()
  const dispatch = useDispatch()
  /**
   * Sends the New User details to the server for Creating User.
   *
   * If the given password is not validated or username or email already present, it will display an error message.
   * @param body
   * @returns {Promise} resolves when the signup is successful.
   */
  const onSubmit = (body) => {
    return signUp({ ...body })
      .then((response) => {
        response.privateKey = getPrivateKey({
          userId: response._id,
          email: body.email,
          password: body.password
        })
        response.email = body.email
        dispatch(signUpSuccessful(response))
      })
      .catch((e) => {
        setError('password', {
          type: 'manual',
          message: t('SignUp.passwordError')
        })
      })
  }

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <h1>{t('SignUp.title')}</h1>
        <div className="container fluid" id="signupForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              {/* <input
                name="email"
                placeholder={t('SignUp.email')}
                className="form-control"
                ref={register({
                  required: t('SignUp.emailRequiredError'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('SignUp.emailErrorMessage')
                  }
                })}
              /> */}
              {errors.email && errors.email.message}
            </div>
            <div className="form-group">
              {/* <input
                name="displayName"
                placeholder={t('SignUp.displayName')}
                className="form-control"
                ref={register({
                  required: t('SignUp.emailRequiredError')
                })}
              /> */}
              {errors.displayName && errors.displayName.message}
            </div>
            <div className="form-group">
              {/* <input
                name="password"
                type="password"
                placeholder={t('SignUp.password')}
                className="form-control"
                ref={register({
                  required: t('SignUp.passwordRequiredError'),
                  minLength: {
                    value: 6,
                    message: t('SignUp.passwordErrorMessage')
                  }
                })}
              /> */}
              <Alert variant={'danger'}>This is a alert—check it out!</Alert>
              <Form>
                <Form.Control
                  name="user"
                  type="email"
                  placeholder={t('SignUp.email')}
                  className="mb-3"
                />
                <Form.Control
                  type="text "
                  name="firstName"
                  placeholder={t('SignUp.firstName')}
                  className="mb-3"
                />

                <Form.Control
                  type="text"
                  name="lastName "
                  placeholder={t('SignUp.lastName')}
                  className="mb-3"
                />

                <Form.Control
                  type="password"
                  name="password"
                  placeholder={t('SignUp.password')}
                  className="mb-3"
                />

                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder={t('SignUp.confirmPassword')}
                  className="mb-3"
                />
              </Form>
              <Alert variant={'danger'}>This is a alert—check it out!</Alert>
            </div>
            {errors.password && errors.password.message}
            {/* <button type="submit" className="btn btn-primary">
              {t('SignUp.submit')}
            </button> */}
            <Button type="submit" className="btn btn-primary">
              {' '}
              {t('SignUp.title')}
            </Button>
          </form>
          <p className="mt-3">
            {t('SignUp.accountMessage')}{' '}
            <Link to="/signup">{t('SignUp.create')}</Link>
          </p>
          <p className="mt-3">
            {t('SignUp.forgotPassword')}{' '}
            <Link to="/forgotpassword">{t('SignUp.reset')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
