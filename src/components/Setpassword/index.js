import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { unwrapResult } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'

import Avatar from '../Base/Avatar'
import { Statuses } from '../../constants'
import { updatePassword } from '../../state/user/user.actions'
import { checkTemporaryPassword } from '../../services/authentication.service'

/**
 * Component for Changing Password.
 * @constructor
 */
export default function SetPassword() {
  const { userId, temporaryToken } = useParams()
  const [status, setStatus] = useState("")
  const [isValidToken, setIsValidToken] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [token, setToken] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { loading } = useSelector(state => state.user);

  useEffect(() => {
    handleCheckTemporaryPassword()
  }, [])

  const handleCheckTemporaryPassword = async () => {
    try {
      const response = await checkTemporaryPassword(userId, temporaryToken)
      setToken(response.authToken.token)
      setIsValidToken(true)
    } catch (error) {
      console.log(error);
      setStatus(Statuses.ERROR)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus(Statuses.SUBMITTED)

    if (!isPasswordSame) {
      setStatus(t('SignUp.passwordsUnmatched'));
      return;
    } else if (isPasswordEmpty) {
      setStatus(t('SetPassword.passwordRequired'));
      return;
    } else if (isPasswordShort) {
      setStatus(t('SetPassword.passwordShort'));
      return;
    }

    try {
      let result = await dispatch(updatePassword({
        token,
        passwordData: {
          oldPassword: temporaryToken,
          newPassword: passwordData.newPassword
        }
      }));
      setStatus("")
      result = unwrapResult(result);
      history.push('/login');

    } catch (error) {}
  }

  const isPasswordSame = passwordData.newPassword === passwordData.confirmPassword
  const isPasswordEmpty = !passwordData.newPassword
  const isPasswordShort = passwordData.newPassword.length < 6

  return (
    <div className="demo mb-3">
      {isValidToken
        ? (
          <div id="login" className="text-center mb-0">
            <div className="d-flex justify-content-center align-items-center">
              <Avatar />
            </div>
            <hr></hr>
            <h3 className="my-3">{t('ChangePassword.title')}</h3>
            <h5 className="my-3">{t('ChangePassword.cautionMessage')} </h5>
            <div className="container fluid" id="signup-Form">
              <Form onSubmit={onSubmit} className="change-pass">
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
                {status && status === Statuses.SUBMITTED && (
                  <Alert variant={'success'} className="error-alert">
                    {status}
                  </Alert>
                )}

                {status && status !== Statuses.SUBMITTED && (
                  <Alert variant={'danger'} className="error-alert">
                    {status}
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="my-3"
                  variant="success"
                  disabled={loading}
                >
                  {t('ChangePassword.submit')}
                </Button>
              </Form>
            </div>
          </div>
        )
        : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <p>
              {' '}
              {t('SetPassword.please')}
              <Link to="/login"> {t('SetPassword.login')} </Link>
              {t('SetPassword.toSeeThePage')}
            </p>
          </div>
        )}
    </div>
  )
}
