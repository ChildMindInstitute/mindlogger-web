import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../../store'
import Avatar from '../Base/Avatar'
import {
  authTokenSelector,
  userInfoSelector
} from '../../state/user/user.selectors'
import { updatePassword } from '../../services/authentication.service'
import { updateUserDetailsSuccessful } from '../../state/user/user.thunks'
import { Form, Alert, Button } from 'react-bootstrap'
import { Statuses } from '../../constants'
import './styles.css'

/**
 * Component for Changing Password.
 * @constructor
 */
export default function ChangePassword () {
  const [status, setStatus] = useState(Statuses.READY)
  const [passwordData, setPasswordData] = useState({
    oldpassword: ' ',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const { t } = useTranslation()
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
  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus(Statuses.LOADING)
    try {
      await updatePassword(authToken, passwordData)
      dispatch(updateUserDetailsSuccessful(user))
      history.push('/profile')
    } catch ({ message }) {
      setError(message)
      setStatus(Statuses.READY)
    }
  }

  const isPasswordSame =
    passwordData.newPassword === passwordData.confirmPassword

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <div className="d-flex justify-content-center align-items-center">
        <Avatar />
        <h1>{t('ChangePassword.settings')}</h1>
        </div>
        <hr></hr>
        <h3>{t('ChangePassword.title')}</h3>
        <h5>{t('ChangePassword.cautionMessage')} </h5>
        <div className="container fluid" id="signup-Form">
          <Form onSubmit={onSubmit} className="change-pass">
            {error && (
              <Alert variant={'danger'} className="error-alert">
                {error}
              </Alert>
            )}
            <div>
              <Form.Label>{t('ChangePassword.oldPassword')}:</Form.Label>
              <Form.Control
                type="password"
                name="Old password"
                value={passwordData.oldPassword}
                placeholder={t('ChangePassword.oldPassword')}
                className="mb-1"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Form.Label>{t('ChangePassword.newPassword')}:</Form.Label>
              <Form.Control
                type="password"
                name="New password"
                value={passwordData.newPassword}
                placeholder={t('ChangePassword.newPassword')}
                className="mb-1"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })
                }
              />
            </div>

            <div>
              <Form.Label>{t('ChangePassword.confirmPassword')}:</Form.Label>
              <Form.Control
                type="password"
                name="Confirm Password"
                value={passwordData.confirmPassword}
                placeholder={t('ChangePassword.confirmPassword')}
                className="mb-1"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })
                }
              />
            </div>
            {!isPasswordSame && (
              <Alert variant={'danger'} className="error-alert">
                {t('SignUp.passwordsUnmatched')}
              </Alert>
            )}
            <Button
              type="submit"
              variant="success"
              disabled={
                status === Statuses.LOADING ||
                !isPasswordSame ||
                !passwordData.oldpassword
              }
            >
              {t('ChangePassword.submit')}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
