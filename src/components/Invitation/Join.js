import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import {useTranslation} from "react-i18next";

import { Statuses } from '../../constants';
import { InviteLink } from './InviteLink';
import { SignIn } from '../Signin/SignIn';
import { loggedInSelector } from '../../state/user/user.selectors';
import { acceptInviteLink, getInviteLinkInfo } from '../../state/app/app.actions';

export const Join = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const { inviteLinkId } = useParams();

  const [status, setStatus] = useState(Statuses.LOADING);

  const [inviteLink, setInviteLink] = useState('');

  const isLoggedIn = useSelector(loggedInSelector);
  const { info } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      await getInviteLink();
    })();

  }, [inviteLinkId]);

  const getInviteLink = async () => {
    if (!inviteLinkId) {
      setStatus(Statuses.ERROR);
      return;
    }

    try {
      const { payload } = await dispatch(getInviteLinkInfo(inviteLinkId));

      setInviteLink(payload);

      setStatus(Statuses.READY);
    } catch (error) {
      setStatus(Statuses.ERROR);
    }
  };

  /**
   * Sends request to API for accepting invitation
   * Displays the message from server upon succesful response
   */
  const handleAcceptInvitation = async () => {
    setStatus(Statuses.LOADING);
    try {
      await dispatch(acceptInviteLink(inviteLinkId));

      setStatus(Statuses.ACCEPTED);
    } catch (error) {
      setStatus(Statuses.ERROR);
    }
  };

  const handleDeclineInvitation = () => {
    history.push('/');
  };

  return (
    <div className="mt-3 pt-3 container">
      {renderInviteLink()}
      {renderNotFound()}
    </div>
  );

  function renderInviteLink() {
    if (!inviteLink || [Statuses.ACCEPTED, Statuses.ERROR].includes(status)) {
      return undefined;
    }

    const { inviter, displayName } = inviteLink;
    const { displayName: coordinatorName, email: coordinatorEmail } = inviter;
    const title = `${t('InviteLink.welcome', { displayName })} <br/><br/> 
      ${t('InviteLink.title', { coordinatorName, coordinatorEmail, displayName })} <br/>
    `;
    const description = ` <br/>
      ${t('InviteLink.description', { coordinatorName, coordinatorEmail, displayName })}
      ${t('InviteLink.step1', { displayName })}
      <li>${t('InviteLink.step2', { displayName })}${info ? '' : t('InviteLink.step2_1', { displayName })}</li>
      ${t('InviteLink.step3', { displayName })}
      ${t('InviteLink.footer')}
    `;

    return (
      <div className="invitationBody">
        <p
          dangerouslySetInnerHTML={{
            __html: title,
          }}></p>
        {renderAcceptDeclineInvite()}
        {renderSignIn()}
        <p
          dangerouslySetInnerHTML={{
            __html: description,
          }}></p>
      </div>
    );
  }

  function renderAcceptDeclineInvite() {
    if (!inviteLink  || !isLoggedIn && status !== Statuses.LOADING) {
      return undefined;
    }

    return (
      <InviteLink status={status} onAcceptInvite={handleAcceptInvitation} onDeclineInvite={handleDeclineInvitation} />
    );
  }

  function renderSignIn() {
    if (isLoggedIn || status === Statuses.LOADING) {
      return undefined;
    }

    return <SignIn redirectUrl={location.pathname}></SignIn>;
  }

  function renderNotFound() {
    if (!inviteLink) {
      return <div className="heading">
        <p>{t('InviteLink.notFound')}</p>
      </div>
    }

    return undefined;
  }
};
