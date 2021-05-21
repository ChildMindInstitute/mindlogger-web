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
    const res = await axios.put(url, null, {
      params: { localInfo },
      headers
    });
    const response = res.data;

    if (response.nextActivity) {
      return new Promise(resolve => setTimeout(() => resolve(getAppletsAPI(token, localInfo, response.currentApplet, response.nextActivity).then(next => {
        for (const applet of next.data) {
          const d = response.data.find(d => d.id == applet.id);
          if (!d) {
            response.data.push(applet);
            continue;
          }

          for (const IRI in applet.items) {
            d.items[IRI] = applet.items[IRI]
          }

          for (const IRI in applet.activities) {
            d.activities[IRI] = applet.activities[IRI]
          }
        }

        return response;
      })), 50));
    }
    return response;
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}
