import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useParams, useLocation, useHistory} from 'react-router-dom'

import { Statuses } from '../../constants'
import {InviteLink} from './InviteLink';
import {JoinInfo} from './JoinInfo';
import { setRedirectUrl } from '../../state/app/app.reducer'
import { SignIn } from '../Signin/SignIn';
import { loggedInSelector } from '../../state/user/user.selectors'
import { acceptInviteLink, getInviteLinkInfo} from '../../state/app/app.actions'

export const Join = () => {
  const history = useHistory()

  const { inviteLinkId } = useParams()

  const [status, setStatus] = useState(Statuses.LOADING)

  const [inviteLink, setInviteLink] = useState('')

  const isLoggedIn = useSelector(loggedInSelector)

  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(setRedirectUrl(location.pathname))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    (async () => {
      await getInviteLink();
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteLinkId])

  const getInviteLink = async () => {
    if (!inviteLinkId) {
      setStatus(Statuses.ERROR)
      return;
    }

    try {
      const { payload } = await dispatch(getInviteLinkInfo(inviteLinkId))

      setInviteLink(payload);

      setStatus(Statuses.READY)
    } catch (error) {
      setStatus(Statuses.ERROR)
    }
  }

  /**
   * Sends request to API for accepting invitation
   * Displays the message from server upon succesful response
   */
  const handleAcceptInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      await dispatch(acceptInviteLink(inviteLinkId))

      setStatus(Statuses.ACCEPTED)
    } catch (error) {
      setStatus(Statuses.ERROR)
    }
  }

  const handleDeclineInvitation = () => {
    history.push('/')
  }

  return (
    <div className="mt-3 pt-3 container">
      {renderInviteLink()}

      {renderAcceptDeclineInvite()}

      {renderSignIn()}
    </div>
  )

  function renderInviteLink() {
    if (!inviteLink) {
      return undefined;
    }

    return <JoinInfo inviteLink={inviteLink}></JoinInfo>
  }

  function renderAcceptDeclineInvite() {
    if (!isLoggedIn && status !== Statuses.LOADING) {
      return undefined;
    }

    return <InviteLink
        status={status}
        onAcceptInvite={handleAcceptInvitation}
        onDeclineInvite={handleDeclineInvitation}
    />
  }

  function renderSignIn() {
    if (isLoggedIn || status === Statuses.LOADING) {
      return undefined;
    }

    return <SignIn></SignIn>
  }
}
