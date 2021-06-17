/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner } from 'react-bootstrap'

import { Statuses } from '../../constants'

import {InvitationButtons} from './InvitationButtons';

import './style.css'

export const InviteLink = ({ status, onAcceptInvite, onDeclineInvite }) => {
  const { t } = useTranslation()

  switch (status) {
    case Statuses.LOADING:
      return (
        <div className="heading">
          <h1>{t('InvitationLink.loading')}</h1>
          <Spinner animation="border" variant="primary" />
        </div>
      )

    case Statuses.READY:
      return (
          <InvitationButtons
              onAcceptInvite={onAcceptInvite}
              onDeclineInvite={onDeclineInvite}
          />
      )

    case Statuses.ERROR:
      return (
        <div className={'heading'}>
          {t('InvitationText.networkError')}{' '}
          <Link to={'/profile'}>{t('InvitationText.home')}</Link>
        </div>
      )

    case Statuses.ACCEPTED:
      return (
        <div className={'heading'}>
          <h1 className={'invitationMessage'}>
            {t('InvitationText.acceptInvitation')}
          </h1>
        </div>
      )

    default:
      return null
  }
}
