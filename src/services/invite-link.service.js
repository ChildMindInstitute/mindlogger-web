import axios from "axios";

import {apiHost} from "./network";

export const getInviteLinkInfoAPI = async ({ inviteLinkId }) => {
    try {
        const response = await axios.get(`${apiHost()}/applet/invitelink/${inviteLinkId}/info`)
        return response.data
    } catch (error) {
        throw new Error(error)
    }
}

export const acceptInviteLinkAPI = async ({ token, inviteLinkId }) => {
    const url = `${apiHost()}/applet/invitelink/${inviteLinkId}/accept`
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
