import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'
import { Form, Alert, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Avatar from '../Base/Avatar'
import { updatePassword } from '../../state/user/user.actions'

import './styles.css'

/**
 * Component for Changing Password.
 * @constructor
 */
export default () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [state, setErrorSuccess] = useState({
    type: '',
    message: ''
  })

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { loading, info: user, auth: authToken } = useSelector(state => state.user);

  /**
   * Takes old password and new password, sents it to the backend for changing the password
   * @param oldPassword
   * @param password
   * @returns {Promise} resolves when the password gets successfully changed.
   */
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      let result = await dispatch(updatePassword({ token: authToken && authToken.token, passwordData }));
      result = unwrapResult(result);

      setErrorSuccess({
        type: 'success',
        message: t('ChangePassword.success')
      })
    } catch (error) {
      setErrorSuccess({
        type: 'error',
        message: error.message
      })
    }
  }

  const isPasswordSame = passwordData.newPassword === passwordData.confirmPassword

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <div className="d-flex justify-content-center align-items-center">
          <Avatar />
          <h1>{t('ChangePassword.settings')}</h1>
        </div>
        <hr></hr>
        <h3 className="my-3">{t('ChangePassword.title')}</h3>
        <h5 className="mb-3">{t('ChangePassword.cautionMessage')} </h5>
        <div className="container fluid my-4" id="signup-Form">
          <Form onSubmit={onSubmit} className="change-pass">
            <div>
              <Form.Label>{t('ChangePassword.oldPassword')}:</Form.Label>
              <Form.Control
                type="password"
                name="Old password"
                value={passwordData.oldPassword}
                placeholder={t('ChangePassword.oldPassword')}
                className="mb-2"
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
                className="mb-2"
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
                className="mb-2"
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
              className="my-3"
              variant="success"
              disabled={
                loading ||
                !isPasswordSame ||
                !passwordData.oldPassword
              }
            >
              {t('ChangePassword.submit')}
            </Button>

            {isPasswordSame && state.type === 'error' && (
              <Alert variant={'danger'} className="error-alert">
                { state.message }
              </Alert>
            )}

            {isPasswordSame && state.type === 'success' && (
              <Alert variant={'success'} className="success-alert">
                { state.message }
              </Alert>
            )}

          </Form>
        </div>
      </div>
    </div>
  )
}
