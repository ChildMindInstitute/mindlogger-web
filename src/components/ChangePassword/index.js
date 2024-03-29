import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'
import { Form, Alert, Button, Row, Col } from 'react-bootstrap'
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
      if (passwordData.newPassword.length < 6) {
        setErrorSuccess({
          type: 'error',
          message: t('SetPassword.passwordShort')
        })
        return;
      }
      if (passwordData.newPassword.includes(" ")) {
        setErrorSuccess({
          type: 'error',
          message: t('SetPassword.passwordBlank')
        })
        return;
      }
      if (passwordData.newPassword === passwordData.oldPassword) {
        setErrorSuccess({
          type: 'error',
          message: t('SetPassword.passwordSame')
        })
        return;
      }
      let result = await dispatch(updatePassword({ token: authToken && authToken.token, passwordData }));
      result = unwrapResult(result);

      setErrorSuccess({
        type: 'success',
        message: t('ChangePassword.success')
      })
    } catch (error) {
      if (error.message === "Error: Password must be at least 6 characters.") {
        setErrorSuccess({
          type: 'error',
          message: t('ChangePassword.passwordErrorMessage')
        })
      } else if (error.message === "Error: Old password is incorrect.") {
        setErrorSuccess({
          type: 'error',
          message: t('ChangePassword.oldPasswordIncorrect')
        })
      } else {
        setErrorSuccess({
          type: 'error',
          message: t('SetPassword.failed')
        })
      }

    }
  }

  const isPasswordSame = passwordData.newPassword === passwordData.confirmPassword

  return (
    <div className="demo mb-3">
      <div id="login" className="text-center mb-0">
        <div className="d-flex justify-content-center align-items-center">
          <Avatar />
          <h1>{t('ChangePassword.settings', { name: user.firstName })}</h1>
        </div>
        <hr></hr>
        <h3 className="my-3">{t('ChangePassword.title')}</h3>
        <h5 className="mb-3">{t('ChangePassword.cautionMessage')} </h5>
        <div className="container fluid" id="signup-Form">
          <Form onSubmit={onSubmit} className="change-pass">
            <Form.Group as={Row}>
              <Form.Label column sm="3">
                {t('ChangePassword.oldPassword')}:
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="password"
                  name="Old password"
                  value={passwordData.oldPassword}
                  placeholder={t('ChangePassword.oldPassword')}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value
                    })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm="3">
                {t('ChangePassword.newPassword')}:
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="password"
                  name="New password"
                  value={passwordData.newPassword}
                  placeholder={t('ChangePassword.newPassword')}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm="3">
                {t('ChangePassword.confirmPassword')}:
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="password"
                  name="Confirm Password"
                  value={passwordData.confirmPassword}
                  placeholder={t('ChangePassword.confirmPassword')}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })
                  }
                />
              </Col>
            </Form.Group>
            {!isPasswordSame && (
              <Alert variant={'danger'} className="error-alert">
                {t('SignUp.passwordsUnmatched')}
              </Alert>
            )}
            <Button
              type="submit"
              className="my-2"
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
