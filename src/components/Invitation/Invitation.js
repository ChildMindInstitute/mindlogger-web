import React, { useEffect, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { Statuses } from '../../constants';
import { InvitationText } from './InvitationText';
import { SignIn } from '../Signin/SignIn';
import { setRedirectUrl } from '../../state/app/app.reducer';
import { loggedInSelector } from '../../state/user/user.selectors';
import { getInvitation, acceptInvitation, declineInvitation } from '../../state/app/app.actions';

import './style.css';

const Invitation = () => {
  const { invitationId } = useParams();
  const [status, setStatus] = useState(Statuses.LOADING);
  const [invitationText, setInvitationText] = useState('');
  const [invitationText2, setInvitationText2] = useState('');

  const isLoggedIn = useSelector(loggedInSelector);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setRedirectUrl(location.pathname));
  }, []);

  useEffect(() => {
    if (isLoggedIn) handleGetInvitation();
  }, [isLoggedIn]);

  /**
   * Makes request to server to get details about the invitation
   * Displays the status of invitation
   */
  const handleGetInvitation = async () => {
    setStatus(Statuses.LOADING);
    try {
      const res = await dispatch(getInvitation(invitationId));
      const { body, body2, acceptable } = unwrapResult(res);

      setInvitationText(body);
      setInvitationText2(body2);
      setStatus(acceptable ? Statuses.READY : Statuses.ALREADY_ACCEPTED);

      if (!acceptable) {
        dispatch(setRedirectUrl(null));
      }
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
      const res = await dispatch(acceptInvitation(invitationId));
      const { body } = unwrapResult(res);

      setStatus(Statuses.ACCEPTED);
      setInvitationText(body);
      dispatch(setRedirectUrl(null));
    } catch (error) {
      setStatus(Statuses.ERROR);
    }
  };

  /**
   * Sends request to API for decling invitation
   * Displays the message from server upon succesful response
   */
  const handleRemoveInvitation = async () => {
    setStatus(Statuses.LOADING);
    try {
      const res = await dispatch(declineInvitation(invitationId));
      const { body } = unwrapResult(res);

      setStatus(Statuses.REMOVED);
      setInvitationText(body);
      dispatch(setRedirectUrl(null));
    } catch (error) {
      setStatus(Statuses.ERROR);
    }
  };

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn ? (
        <InvitationText
          status={status}
          invitationText={invitationText}
          invitationText2={invitationText2}
          onAcceptInvite={handleAcceptInvitation}
          onDeclineInvite={handleRemoveInvitation}
        />
      ) : (
        <SignIn></SignIn>
      )}
    </div>
  );
};

export default Invitation;
