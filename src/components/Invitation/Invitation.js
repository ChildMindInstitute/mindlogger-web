import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  loggedInSelector,
  userInfoSelector,
  authTokenSelector
} from '../../state/user/user.selectors'
import { Statuses } from '../../constants'
import { InvitationText } from './InvitationText'
import {
  getInvitation,
  acceptInvitation,
  declineInvitation
} from '../../services/invitation.service'
import './style.css'

const Invitation = () => {
  const { t } = useTranslation()
  const [status, setStatus] = React.useState(Statuses.LOADING)
  const [invitationText, setInvitationText] = React.useState('')
  const isLoggedIn = useSelector(loggedInSelector)
  const user = useSelector(userInfoSelector)
  const token = useSelector(authTokenSelector)
  const { invitationId } = useParams()

  React.useEffect(() => {
    if (isLoggedIn) handleGetInvitation()
  }, [isLoggedIn])

  /**
   * Makes request to server to get details about the invitation
   * Displays the status of invitation
   */
  const handleGetInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const { body, acceptable } = await getInvitation({ invitationId, token })
      setInvitationText(body)
      setStatus(
        acceptable
          ? Statuses.READY
          : Statuses.ALREADY_ACCEPTED
      )
    } catch (err) {
      console.log({ err })
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
      const { body } = await acceptInvitation({
        token,
        invitationId,
        email: user.email
      })
      setStatus(Statuses.ACCEPTED)
      setInvitationText(body)
    } catch {
      setStatus(Statuses.ERROR)
    }
  }

  /**
   * Sends request to API for decling invitation
   * Displays the message from server upon succesful response
   */
  const handleRemoveInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const { body } = await declineInvitation({ invitationId, token })
      setStatus(Statuses.REMOVED)
      setInvitationText(body)
    } catch {
      setStatus(Statuses.ERROR)
    }
  }

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn
        ? (
        <InvitationText
          status={status}
          invitationText={invitationText}
          onAcceptInvite={handleAcceptInvitation}
          onDeclineInvite={handleRemoveInvitation}
        />
          )
        : (
        <div className="heading">
          {t('Invitation.please')} <Link to={'/login'}>{t('Invitation.login')}</Link> {t('Invitation.or')}{' '}
          <Link to={'/signup'}>{t('Invitation.singUp')}</Link> {t('Invitation.viewInvitation')}
        </div>
          )}
    </div>
  )
}

export default Invitation
