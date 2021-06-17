import React from 'react';

import { useTranslation } from 'react-i18next';

export const JoinInfo = ({ inviteLink }) => {
  const { t } = useTranslation();

  const { inviter, displayName, reviewer, manager, coordinator } = inviteLink;

  const { displayName: coordinatorName, email: coordinatorEmail } = inviter;

  return (
    <div className="invitationBody">
      <p
        dangerouslySetInnerHTML={{
          __html: t('InviteLink.title', { coordinatorName, coordinatorEmail, displayName }),
        }}></p>

      {renderUsers({ labelKey: 'InviteLink.reviewers', users: reviewer })}
      {renderUsers({ labelKey: 'InviteLink.managers', users: manager })}
      {renderUsers({ labelKey: 'InviteLink.coordinators', users: coordinator })}
    </div>
  );

  function renderUsers({ labelKey, users }) {
    if (!users || users.length <= 0) {
      return undefined;
    }

    return (
      <>
        <h3>{t(labelKey)}</h3>
        <ul>
          {users.map(({ displayName: userName, email: userEmail }, index) => (
            <li key={`${labelKey}-${index}`}>
              {userName} ({userEmail})
            </li>
          ))}
        </ul>
      </>
    );
  }
};
