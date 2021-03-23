import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  loggedInSelector,
  authTokenSelector,
  userInfoSelector
} from '../../state/user/user.selectors'
import { InvitationText } from './InvitationText'
import { Statuses } from '../../constants'
import { acceptInvitation } from '../../services/invitation.service'
import './style.css'

const AcceptInvitation = () => {
  const [status, setStatus] = React.useState(Statuses.LOADING)
  const [invitationText, setInvitationText] = React.useState('')
  const isLoggedIn = useSelector(loggedInSelector)
  const user = useSelector(userInfoSelector)
  const token = useSelector((state) => authTokenSelector(state))
  const { invitationId } = useParams()
  const { t } = useTranslation()

  React.useEffect(() => {
    if (isLoggedIn) handleAcceptInvitation()
  }, [isLoggedIn])

  /**
   * Sends request to API for accepting invitation
   * Displays the message from server upon succesful response
   */
  const handleAcceptInvitation = async () => {
    setStatus(Statuses.LOADING)
    try {
      const { body } = await acceptInvitation({
        token,
        email: user.email,
        invitationId
      })
      setStatus(Statuses.ACCEPTED)
      setInvitationText(body)
    } catch {
      setStatus(Statuses.ERROR)
    }
  }

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn
        ? (
        <InvitationText status={status} invitationText={invitationText} />
          )
        : (
        <div className="heading">
     {t('AcceptInvitation.please')} <Link to={'/login'}>{t('AcceptInvitation.login')}</Link> {t('AcceptInvitation.or')}{' '}
          <Link to={'/signup'}>{t('AcceptInvitation.singUp')}</Link> {t('AcceptInvitation.acceptInvitation')}
        </div>
          )}
    </div>
  )
}
export default AcceptInvitation
