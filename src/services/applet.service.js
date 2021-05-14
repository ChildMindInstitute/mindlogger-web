import axios from 'axios'
import { apiHost, objectToQueryParams } from './network'

export const getAppletsAPI = async ({ token, localInfo }) => {
  const queryParams = objectToQueryParams({
    role: "user",
    getAllApplets: true,
    retrieveSchedule: true,
    retrieveResponses: true,
    numberOfDays: 7,
    groupByDateActivity: false
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
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}
