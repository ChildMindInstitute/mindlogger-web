import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'

import { history } from '../../store'
import { forgotPassword } from '../../state/user/user.actions'

import './styles.css'

/**
 *
 * Component for requesting new password
 * @constructor
 */
export default function ForgotPassword() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { register, handleSubmit, setError, errors } = useForm()

  /**
   * Sends the forgot password email.
   * @param body
   */
  const onSubmit = async (body) => {
    try {
      let result = await dispatch(forgotPassword(body.email));
      result = unwrapResult(result);
      history.push('/login');

    } catch (error) {
      setError('email', {
        type: 'manual',
        message: t('ForgotPassword.emailError')
      })
    }
  }

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <h1>{t('ForgotPassword.title')}</h1>
        <div className="container fluid" id="signupForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                name="email"
                placeholder={t('ForgotPassword.email')}
                className="form-control"
                ref={register({
                  required: t('ForgotPassword.emailRequiredError'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('ForgotPassword.emailErrorMessage')
                  }
                })}
              />
              {errors.email && errors.email.message}
            </div>
            <button type="submit" className="btn btn-primary">
              {t('ForgotPassword.submit')}
            </button>
          </form>
          {/* <p className="mt-3">{t('ForgotPassword.accountMessage')} <Link to="/signup">{t('ForgotPassword.create')}</Link></p>
          <p className="mt-3">{t('ForgotPassword.forgotPassword')} <Link to="/forgotpassword">{t('ForgotPassword.reset')}</Link></p> */}
          <p>
            {t('ForgotPassword.rememberPassword')}{' '}
            <Link to="/login">{t('ForgotPassword.logIn')}</Link>{' '}
          </p>
        </div>
      </div>
    </div>
  )
}
