import { apiHost } from './network'
import axios from 'axios'

export const getInvitation = async ({ token, invitationId }) => {
  const url = `${apiHost()}/invitation/${invitationId}?includeLink=false`
  const headers = {
    'Girder-Token': token
  }
  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const declineInvitation = async ({ invitationId, token }) => {
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

export const acceptInvitation = async ({ token, email, invitationId }) => {
  const url = `${apiHost()}/invitation/${invitationId}/accept?email=${email}`
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
