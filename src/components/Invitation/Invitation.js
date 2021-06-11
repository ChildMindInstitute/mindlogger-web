import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Statuses } from '../../constants'
import { InvitationText } from './InvitationText'
import { setRedirectUrl } from '../../state/app/app.reducer'
import { loggedInSelector } from '../../state/user/user.selectors'
import { getInvitation, acceptInvitation, declineInvitation } from '../../state/app/app.actions'

import './style.css'

const Invitation = () => {
  const { t } = useTranslation()
  const { invitationId } = useParams()
  const [status, setStatus] = useState(Statuses.LOADING)
  const [invitationText, setInvitationText] = useState('')
  
  const isLoggedIn = useSelector(loggedInSelector)
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(setRedirectUrl(location.pathname))
  }, [])

  useEffect(() => {
    if (isLoggedIn) handleGetInvitation()
  }, [isLoggedIn])

  /**
   * Makes request to server to get details about the invitation
   * Displays the status of invitation
   */
  const handleGetInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const res = await dispatch(getInvitation(invitationId))
      const { body, acceptable } = unwrapResult(res)

      setInvitationText(body)
      setStatus(acceptable ? Statuses.READY : Statuses.ALREADY_ACCEPTED)
    } catch (error) {
      setStatus(Statuses.ERROR)
    }
  }

  /**
   * Sends request to API for accepting invitation
   * Displays the message from server upon succesful response
   */
  const handleAcceptInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const res = await dispatch(acceptInvitation(invitationId))
      const { body } = unwrapResult(res);

      setStatus(Statuses.ACCEPTED)
      setInvitationText(body)
    } catch (error) {
      setStatus(Statuses.ERROR)
    }
  }

  /**
   * Sends request to API for decling invitation
   * Displays the message from server upon succesful response
   */
  const handleRemoveInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const res = await dispatch(declineInvitation(invitationId))
      const { body } = unwrapResult(res);

      setStatus(Statuses.REMOVED)
      setInvitationText(body)
    } catch (error) {
      setStatus(Statuses.ERROR)
    }
  }

  const handleLogin = () => {
    history.push('/login')
  }

  const handleSignup = () => {
    history.push('/signup')
  }

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn
        ?
        <InvitationText
          status={status}
          invitationText={invitationText}
          onAcceptInvite={handleAcceptInvitation}
          onDeclineInvite={handleRemoveInvitation}
        />
        : <div className="heading">
          {t('Invitation.please')}{' '}
          <Button 
            type="button"
            className="btn btn-primary mx-1"
            onClick={handleLogin}
          >
            {t('Invitation.login')}
          </Button>
          {t('Invitation.or')}{' '}
          <Button
            type="button"
            className="btn btn-success mx-1"
            onClick={handleSignup}
          >
            {t('Invitation.singUp')} 
          </Button>
        </div>
      }
    </div>
  )
}

export default Invitation
