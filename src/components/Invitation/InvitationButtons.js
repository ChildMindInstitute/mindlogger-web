import React from 'react';

import { Button } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

export const InvitationButtons = ({ onAcceptInvite, onDeclineInvite }) => {
  const { t } = useTranslation();

  return (
    <div className={'invitation-buttons'}>
      <Button onClick={onAcceptInvite} variant="success" className={'mx-2 invitation-button mb-2'}>
        {t('InvitationButtons.acceptInvitation')}
      </Button>
      <Button onClick={onDeclineInvite} variant="danger" className={'mx-2 invitation-button mb-2'}>
        {t('InvitationButtons.declineInvitation')}
      </Button>
    </div>
  );
};
