import axios from 'axios'
import { apiHost, objectToQueryParams } from './network'

export const getAppletsAPI = async ({ token, localInfo, currentApplet = '', nextActivity = '' }) => {
  const queryParams = objectToQueryParams({
    role: "user",
    getAllApplets: true,
    retrieveSchedule: true,
    retrieveResponses: true,
    retrieveLastResponseTime: true,
    numberOfDays: 7,
    groupByDateActivity: false,
    currentApplet,
    nextActivity
  });
  const url = `${apiHost()}/user/applets?${queryParams}`;
  const headers = {
    "Girder-Token": token,
  };

  const formData = new FormData();
  formData.set('localInfo', JSON.stringify(localInfo))

  try {
    const response = await axios.put(url, formData, {
      headers
    })

    const res = response.data;

    if (res.nextActivity) {
      return await new Promise(resolve => setTimeout(() => resolve(getAppletsAPI({
        token,
        localInfo,
        currentApplet: res.currentApplet,
        nextActivity: res.nextActivity
      }).then(next => {
        for (const applet of next.data) {
          const d = res.data.find(d => d.id == applet.id);
          if (!d) {
            res.data.push(applet);
            continue;
          }

          for (const IRI in applet.items) {
            d.items[IRI] = applet.items[IRI]
          }

          for (const IRI in applet.activities) {
            d.activities[IRI] = applet.activities[IRI]
          }
        }

        return res;
      })), 50));
    }
    return res;
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export const getPublicAppletAPI = async ({ publicId, nextActivity = '' }) => {
  const url = `${apiHost()}/applet/public/${publicId}/data?nextActivity=${nextActivity}`;

  try {
    const response = await axios.get(url)

    return response.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}
