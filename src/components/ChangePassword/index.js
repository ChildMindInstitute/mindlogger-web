import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../../store'
import {
  authTokenSelector,
  userInfoSelector
} from '../../state/user/user.selectors'
import { updateUserDetailsSuccessful } from '../../state/user/user.thunks'
import { Form, Alert, Button } from 'react-bootstrap'
import { updatePassword } from '../../services/network'

import './styles.css'

/**
 * Component for Changing Password.
 * @constructor
 */
export default function ChangePassword() {
  const { t } = useTranslation()
  const { register, handleSubmit, setError, errors } = useForm()
  const dispatch = useDispatch()

  const authToken = useSelector((state) => authTokenSelector(state))
  const user = useSelector((state) => userInfoSelector(state))

  /**
   * Takes old password and new password, sents it to the backend for changing the password
   * @param oldPassword
   * @param password
   * If the given old password is incorrect, it will display an error message.
   *
   * @returns {Promise} resolves when the password gets successfully changed.
   */
  const onSubmit = ({ oldPassword, password }) => {
    return updatePassword(authToken, oldPassword, password)
      .then(() => {
        history.push('/profile')
      })
      .then(() => dispatch(updateUserDetailsSuccessful(user)))
      .catch((e) => {
        setError('password', {
          type: 'manual',
          message: t('ChangePassword.passwordError')
        })
      })
  }

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <h1>{t('ChangePassword.settings')}</h1>
        <hr></hr>
        <h3>{t('ChangePassword.title')}</h3>
        <h5>{t('ChangePassword.cautionMessage')} </h5>
        <div className="container fluid" id="signup-Form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Alert variant="danger" className="error-alert">
              This is a alert—check it out!
            </Alert>
            {/* <div className="form-group">
              <input
                name="oldPassword"
                type="password"
                placeholder={t('ChangePassword.oldPassword')}
                className="form-control"
                ref={register({
                  required: t('ChangePassword.passwordRequiredError'),
                  minLength: {
                    value: 6,
                    message: t('ChangePassword.passwordErrorMessage')
                  }
                })}
              />
            </div> */}
            {errors.oldPassword && errors.oldPassword.message}
            <div className="form-group">
              {/* <input
                name="password"
                type="password"
                placeholder={t('ChangePassword.password')}
                className="form-control"
                ref={register({
                  required: t('ChangePassword.passwordRequiredError'),
                  minLength: {
                    value: 6,
                    message: t('ChangePassword.passwordErrorMessage')
                  }
                })}
              /> */}
              <Form className="change-pass">
                <div>
                  <Form.Label>{t('ChangePassword.oldPassword')}:</Form.Label>
                  <Form.Control
                    type="password"
                    name="Old password"
                    placeholder={t('ChangePassword.oldPassword')}
                    className="mb-1"
                  />
                </div>

                <div>
                  <Form.Label>{t('ChangePassword.newPassword')}:</Form.Label>
                  <Form.Control
                    type="password"
                    name="New password"
                    placeholder={t('ChangePassword.newPassword')}
                    className="mb-1"
                  />
                </div>

                <div>
                  <Form.Label>
                    {t('ChangePassword.confirmPassword')}:
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="Confirm Password"
                    placeholder={t('ChangePassword.confirmPassword')}
                    className="mb-1"
                  />
                </div>
                <Alert variant="danger" className="error-alert">
                  This is a alert—check it out!
                </Alert>
              </Form>
            </div>
            {errors.password && errors.password.message}
            {/* <button type="submit" className="btn btn-primary">{t('ChangePassword.submit')}</button> */}
            <Button type="submit" variant="success">
              {' '}
              {t('ChangePassword.submit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
