/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'react-bootstrap';

import { Statuses } from '../../constants';

import { InvitationButtons } from './InvitationButtons';

import './style.css';

export const InvitationText = (props) => {
  const { status, invitationText, invitationText2, onAcceptInvite, onDeclineInvite } = props;
  const { t } = useTranslation();

  switch (status) {
    case Statuses.LOADING:
      return (
        <div className="heading">
          <div className="loading">{t('InvitationText.loadingInvitation')}</div>
          <Spinner animation="border" variant="primary" />
        </div>
      );

    case Statuses.READY:
      return (
        <React.Fragment>
          <div className={'invitationBody'} dangerouslySetInnerHTML={{ __html: invitationText }} />
          <InvitationButtons onAcceptInvite={onAcceptInvite} onDeclineInvite={onDeclineInvite} />
          <div className={'invitationBody'} dangerouslySetInnerHTML={{ __html: invitationText2 }} />
          <div style={{paddingBottom: "30px"}}/>
        </React.Fragment>
      );

    case Statuses.ALREADY_ACCEPTED:
      return <div className={'invitationBody alreadyAccepted'} dangerouslySetInnerHTML={{ __html: invitationText }} />;

    case Statuses.ERROR:
      return (
        <div className={'heading'}>
          <div className={'invitationMessage'}>{t('InvitationText.invitationAlreadyRemoved')}</div>
        </div>
      );

    case Statuses.ACCEPTED:
      return (
        <div className={'heading'}>
          <div className={'invitationMessage'}>{invitationText || t('InvitationText.acceptInvitation')}</div>
        </div>
      );

    case Statuses.DECLINED:
      return (
        <div className={'heading'}>
          <div className={'invitationMessage'}>{invitationText}</div>
        </div>
      );
    case Statuses.REMOVED:
      return (
        <div className={'heading'}>
          <div className={'invitationMessage'}>{t('InvitationText.invitationRemoved')}</div>
        </div>
      );

    default:
      return null;
  }
}
