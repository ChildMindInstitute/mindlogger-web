import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Button } from 'react-bootstrap'

import { Statuses } from '../../constants'

import './style.css'

export const InvitationText = (props) => {
  const { status, invitationText, onAcceptInvite, onDeclineInvite } = props;
  const { t } = useTranslation()

  switch (status) {
    case Statuses.LOADING:
      return (
        <div className="heading">
          <h1>{t('InvitationText.loadingInvitation')}</h1>
          <Spinner animation="border" variant="primary" />
        </div>
      )

    case Statuses.READY:
      return (
        <React.Fragment>
          <div
            className={'invitationBody'}
            dangerouslySetInnerHTML={{ __html: invitationText }}
          />
          <InvitationButtons
            t={t}
            onAcceptInvite={onAcceptInvite}
            onDeclineInvite={onDeclineInvite}
          />
        </React.Fragment>
      )

    case Statuses.ALREADY_ACCEPTED:
      return (
        <div
          className={'invitationBody alreadyAccepted'}
          dangerouslySetInnerHTML={{ __html: invitationText }}
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
            {invitationText || t('InvitationText.acceptInvitation')}
          </h1>
        </div>
      )

    case Statuses.DECLINED:
      return (
        <div className={'heading'}>
          <h1 className={'invitationMessage'}>{invitationText}</h1>
        </div>
      )
    case Statuses.REMOVED:
      return (
        <div className={'heading'}>
          <h1 className={'invitationMessage'}>
            {t('InvitationText.invitationRemoved')}
          </h1>
        </div>
      )

    default:
      return null
  }
}

const InvitationButtons = ({ t, onAcceptInvite, onDeclineInvite }) => (
  <div className={'d-flex justify-content-center align-items-center'}>
    <Button
      onClick={onAcceptInvite}
      variant="success"
      className={'mx-2'}
      size="lg"
    >
      {t('InvitationButtons.acceptInvitation')}
    </Button>
    <Button
      onClick={onDeclineInvite}
      variant="danger"
      className={'mx-2'}
      size="lg"
    >
      {t('InvitationButtons.declineInvitation')}
    </Button>
  </div>
)