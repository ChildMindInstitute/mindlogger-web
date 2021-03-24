import axios from 'axios'
import { apiHost } from './network'
import { btoa } from './helper'

export const signIn = async ({ email, password }) => {
  const url = `${apiHost()}/user/authentication`
  const headers = {
    'Girder-Authorization': `Basic ${btoa(`${email}:${password}`)}`
  }
  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export const signUp = async (data) => {
  const url = `${apiHost()}/user`
  try {
    const response = await axios.post(url, null, {
      params: { ...data, admin: true }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export const updatePassword = async (token, data) => {
  const url = `${apiHost()}/user/password`
  const headers = {
    'Girder-Token': token
  }
  try {
    const response = await axios.put(url, null, {
      params: { old: data.oldPassword, new: data.newPassword },
      headers
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export const checkTemporaryPassword = async (userId, token) => {
  const url = `${apiHost()}/user/password/temporary/${userId}`
  try {
    const response = await axios.get(url, {
      params: {
        token
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}
