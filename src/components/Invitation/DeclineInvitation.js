import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams, useLocation } from 'react-router-dom'

import { Statuses } from '../../constants'
import { InvitationText } from './InvitationText'
import { setRedirectUrl } from '../../state/app/app.reducer'
import { declineInvitation } from '../../state/app/app.actions'
import { loggedInSelector } from '../../state/user/user.selectors'

import './style.css'


const DeclineInvitation = () => {
  const { invitationId } = useParams()
  const [status, setStatus] = useState(Statuses.LOADING)
  const [invitationText, setInvitationText] = useState('')
  const isLoggedIn = useSelector(loggedInSelector)

  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(setRedirectUrl(location.pathname))
  }, [])

  useEffect(() => {
    if (isLoggedIn) handleDeclineInvitation()
  }, [isLoggedIn])

  /**
   * Sends request to API for decling invitation
   * Displays the message from server upon succesful response
   */
  const handleDeclineInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const res = await dispatch(declineInvitation(invitationId))
      const { body } = unwrapResult(res);

      setStatus(Statuses.DECLINED)
      setInvitationText(body)
    } catch {
      setStatus(Statuses.ERROR)
    }
  }

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn
        ?
        <InvitationText status={status} invitationText={invitationText} />
        :
        <div className="heading">
          {t('DeclineInvitation.please')}{' '}
          <Link to={'/login'}>{t('DeclineInvitation.login')}</Link>{' '}
          {t('DeclineInvitation.or')}{' '}
          <Link to={'/signup'}>{t('DeclineInvitation.singUp')}</Link>{' '}
          {t('DeclineInvitation.acceptInvitation')}
        </div>
      }
    </div>
  )
}

export default DeclineInvitation
