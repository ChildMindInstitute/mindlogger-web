import axios from 'axios'
import { apiHost, objectToQueryParams } from './network'

export const getAppletsAPI = async ({ token, localInfo, currentApplet = '', nextActivity = '' }) => {
  const queryParams = objectToQueryParams({
    role: "user",
    getAllApplets: true,
    retrieveSchedule: true,
    retrieveResponses: true,
    numberOfDays: 7,
    groupByDateActivity: false,
    currentApplet,
    nextActivity
  });
  const url = `${apiHost()}/user/applets?${queryParams}`;
  const headers = {
    "Girder-Token": token,
  };

  try {
    const response = await axios.put(url, null, {
      params: { localInfo },
      headers
    })
    return response.data.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}
