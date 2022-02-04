import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const JoinInfo = ({ inviteLink }) => {
  const { t } = useTranslation();
  const { info } = useSelector(state => state.user);

  const { inviter, displayName } = inviteLink;

  const { displayName: coordinatorName, email: coordinatorEmail } = inviter;

  const description = `${t('InviteLink.welcome', { displayName })} <br/><br/> 
    ${t('InviteLink.title', { coordinatorName, coordinatorEmail, displayName })} <br/><br/> 
    ${t('InviteLink.description', { coordinatorName, coordinatorEmail, displayName })}
    ${t('InviteLink.step1', { displayName })}
    ${info ? '' : t('InviteLink.step2', { displayName })}
    ${t('InviteLink.step3', { displayName })}
    ${t('InviteLink.footer')}`;

  return (
    <div className="invitationBody">
      <p
        dangerouslySetInnerHTML={{
          __html: description,
        }}></p>
    </div>
  );
};
