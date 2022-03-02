import axios from 'axios'

import { apiHost } from './network'
import { objectToQueryParams } from '../util/utils'

export const getInvitationAPI = async ({ token, invitationId }) => {
  const url = `${apiHost()}/invitation/${invitationId}?includeLink=false&isMobile=${window.innerWidth < 768}`;
  const headers = {
    'Girder-Token': token
  }
  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    if (error.response && error.response.data)
      throw new Error(error.response.data.message)
    else
      throw new Error(error)
  }
}

export const declineInvitationAPI = async ({ invitationId, token }) => {
  const url = `${apiHost()}/invitation/${invitationId}`
  const headers = {
    'Girder-Token': token
  }
  try {
    const response = await axios.delete(url, { headers })
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const acceptInvitationAPI = async ({ token, email, invitationId }) => {
  const url = `${apiHost()}/invitation/${invitationId}/accept?${objectToQueryParams({ email })}`
  const headers = {
    'Girder-Token': token
  }
  try {
    const response = await axios.post(url, null, { headers })
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
