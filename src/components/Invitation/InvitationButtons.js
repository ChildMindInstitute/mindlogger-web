import React from 'react';

import { Button } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

export const InvitationButtons = ({ onAcceptInvite, onDeclineInvite }) => {
  const { t } = useTranslation();

  return (
    <div className={'d-flex justify-content-center align-items-center'}>
      <Button onClick={onAcceptInvite} variant="success" className={'mx-2 invitation-button'}>
        {t('InvitationButtons.acceptInvitation')}
      </Button>
      <Button onClick={onDeclineInvite} variant="danger" className={'mx-2 invitation-button'}>
        {t('InvitationButtons.declineInvitation')}
      </Button>
    </div>
  );
};
