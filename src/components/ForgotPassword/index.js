import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { history } from '../../store'

import { forgotPassword } from '../../services/network'

import './styles.css'

/**
 *
 * Component for requesting new password
 * @constructor
 */
export default function ForgotPassword () {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, errors } = useForm()

  /**
   * Sends the forgot password email.
   *
   * If the given email address is incorrect, it will display an error message.
   * @param body
   * @returns {Promise} resolves when the email has been sent.
   */
  const onSubmit = body => {
    return forgotPassword(body.email)
      .then((response) => {
        history.push('/login')
      })
      .catch((e) => {
        setError('email', {
          type: 'manual',
          message: t('ForgotPassword.emailError')
        })
      })
  }

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <h1>{t('ForgotPassword.title')}</h1>
        <div className="container fluid" id="signupForm">
          <form onSubmit={() => handleSubmit(onSubmit)}>
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
            <button type="submit" className="btn btn-primary">{t('ForgotPassword.submit')}</button>
          </form>
          <p className="mt-3">{t('ForgotPassword.accountMessage')} <Link to="/signup">{t('ForgotPassword.create')}</Link></p>
          <p className="mt-3">{t('ForgotPassword.forgotPassword')} <Link to="/forgotpassword">{t('ForgotPassword.reset')}</Link></p>
        </div>
      </div>
    </div>
  )
}
