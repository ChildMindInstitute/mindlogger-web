import { serialize as objectToFormData } from "object-to-formdata";

import { getStore } from "../store";
import { apiHostSelector } from "../state/app/app.selectors";

export const apiHost = () => {
  const state = getStore().getState(); // Get redux state
  return apiHostSelector(state);
};

export const objectToQueryParams = (obj) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");

export const get = (route, authToken, queryObj = {}, extraHeaders = {}) => {
  const queryParams = queryObj ? `?${objectToQueryParams(queryObj)}` : "";

  const url = `${apiHost()}/${route}${queryParams}`;

  const headers = {
    ...extraHeaders,
  };
  if (authToken) {
    headers["Girder-Token"] = authToken;
  }
  return fetch(url, {
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const postFormData = (route, authToken, body, extraHeaders = {}) => {
  const url = `${apiHost()}/${route}`;
  const headers = {
    "Girder-Token": authToken,
    ...extraHeaders,
  };
  return fetch(url, {
    method: "post",
    mode: "cors",
    headers,
    body: objectToFormData(body),
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const getResponses = (authToken, applet) =>
  get("response", authToken, { applet });

export const getSchedule = (authToken, timezone) =>
  get("schedule", authToken, { timezone });

export const getApplets = (authToken, localInfo) => {
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
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "put",
    mode: "cors",
    headers,
    body: objectToFormData({ localInfo: JSON.stringify(localInfo) }),
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
}

export const getTargetApplet = (authToken, appletId) =>
  get(`user/applet/${appletId}`, authToken, {
    retrieveSchedule: true,
    role: "user",
    getAllApplets: true,
  });

export const exportPDF = (serverIP, authToken, responses, appletId, activityFlowId, activityId, responseId) => {
  const queryParams = objectToQueryParams({ appletId, activityFlowId, activityId, responseId });
  const url = serverIP + (serverIP.endsWith('/') ? '' : '/') + 'send-pdf-report';

  return fetch(`${url}/?${queryParams}`, {
    method: "post",
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
      token: authToken
    },
    body: JSON.stringify({
      responses
    })
  })
}


export const postResponse = ({ authToken, response }) =>
  postFormData(
    `response/${response.applet.id}/${response.activity.id}`,
    authToken,
    {
      metadata: JSON.stringify(response),
    }
  );
export const postAppletBadge = (authToken, badge) => {
  const url = `${apiHost()}/applet/setBadge?badge=${badge}`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "post",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const forgotPasswordAPI = (email) => {
  const queryParams = objectToQueryParams({ email });
  const url = `${apiHost()}/user/password/temporary?${queryParams}`;
  return fetch(url, {
    method: "put",
    mode: "cors",
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const signUp = (userData) => {
  const url = `${apiHost()}/user`;
  return fetch(url, {
    method: "post",
    mode: "cors",
    body: objectToFormData(userData),
  }).then((res) => {
    return res.status === 200 ? res.json() : Promise.reject(res);
  });
};

export const updateUserDetails = (
  authToken,
  { id, firstName, lastName, email }
) => {
  const url = `${apiHost()}/user/${id}`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "put",
    mode: "cors",
    headers,
    body: objectToFormData({
      firstName,
      lastName,
      email,
    }),
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const updatePassword = (authToken, oldPassword, newPassword) => {
  const url = `${apiHost()}/user/password`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "put",
    mode: "cors",
    headers,
    body: objectToFormData({
      old: oldPassword,
      new: newPassword,
    }),
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const fileLink = (file, token) =>
  file
    ? `${apiHost()}/${
    file["@id"]
    }/download?contentDisposition=inline&token=${token}`
    : "";

export const registerOpenApplet = (authToken, schemaURI) => {
  const url = `${apiHost()}/applet/invite`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "post",
    mode: "cors",
    headers,
    body: objectToFormData({ url: schemaURI }),
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

// export const getAppletSchedule = (authToken, appletId) => {
//   const url = `${apiHost()}/applet/${appletId}/schedule?getTodayEvents=true`;
//   const headers = {
//     'Girder-Token': authToken,
//   };
//   return fetch(url, {
//     method: 'get',
//     mode: 'cors',
//     headers,
//   }).then(res => (res.status === 200 ? res.json() : Promise.reject(res)));
// };

export const getAppletSchedule = (authToken, appletId) =>
  get(`applet/${appletId}/schedule`, authToken, {
    getAllEvents: false,
    getTodayEvents: true,
  });

export const getAppletInvites = (authToken) => {
  const url = `${apiHost()}/user/invites`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "get",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const acceptAppletInvite = (authToken, id) => {
  const url = `${apiHost()}/group/${id}/member`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "post",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const declineAppletInvite = (authToken, id) => {
  const url = `${apiHost()}/group/${id}/member`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "delete",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const removeApplet = (authToken, groupId) => {
  const del = false;
  const url = `${apiHost()}/group/${groupId}/member?delete=${del}`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "delete",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const deleteApplet = (authToken, groupId) => {
  const del = true;
  const url = `${apiHost()}/group/${groupId}/member?delete=${del}`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "delete",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const deleteUserAccount = (authToken, userId) => {
  const url = `${apiHost()}/user/${userId}`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "delete",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : Promise.reject(res)));
};

export const getLast7DaysData = ({
  authToken,
  appletId,
  localItems,
  localActivities,
  startDate,
  groupByDateActivity,
}) => {
  let url = `${apiHost()}/response/last7Days/${appletId}`;
  if (!groupByDateActivity) {
    url += `?groupByDateActivity=${groupByDateActivity}`;
  }
  url += `?localItems=${localItems}`;
  url += `?localActivities=${localActivities}`;
  url += `?startDate=${startDate}`;

  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "get",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : res)); // Promise.reject(res)));
};

export const replaceResponseData = ({
  authToken,
  userPublicKey,
  appletId,
  dataSources,
}) => {
  let url = `${apiHost()}/response/${appletId}`;
  const headers = {
    "Girder-Token": authToken,
  };

  return fetch(url, {
    method: "put",
    mode: "cors",
    headers,
    body: objectToFormData({
      responses: JSON.stringify({ dataSources, userPublicKey }),
    }),
  }).then((res) => (res.status === 200 ? res.json() : res));
};

export const sendResponseReuploadRequest = ({ authToken, userPublicKeys }) => {
  const url = `${apiHost()}/user/responseUpdateRequest`;

  const headers = {
    "Girder-Token": authToken,
  };

  return fetch(url, {
    method: "post",
    mode: "cors",
    headers,
    body: objectToFormData({
      userPublicKeys: JSON.stringify(userPublicKeys),
    }),
  }).then((res) => (res.status === 200 ? res.json() : res));
};

export const getUserUpdates = ({ authToken }) => {
  const url = `${apiHost()}/user/updates`;

  const headers = {
    "Girder-Token": authToken,
  };

  return fetch(url, {
    method: "get",
    mode: "cors",
    headers,
  }).then((res) => (res.status === 200 ? res.json() : res));
};


export const updateUserTokenBalance = (authToken, appletId, tokenUpdate, cumulative, version, userPublicKey) => {
  const url = `${apiHost()}/response/${appletId}/updateResponseToken`;
  const headers = {
    "Girder-Token": authToken,
  };
  return fetch(url, {
    method: "post",
    mode: "cors",
    headers,
    body: objectToFormData({
      updateInfo: JSON.stringify({
        tokenUpdate,
        cumulative,
        version,
        userPublicKey,
      })
    })
  }).then(res => (res.status === 200 ? res.json() : Promise.reject(res)));
};
