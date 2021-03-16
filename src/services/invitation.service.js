import { apiHost } from "./network";

export const declineInvitation = async ({ invitationId, token }) => {
  const url = `${apiHost()}/invitation/${invitationId}`;
  const headers = {
    "Girder-Token": token,
  };
  const res = await fetch(url, {
    method: "delete",
    mode: "cors",
    headers,
  });
  if (res.ok) return await res.json();
  else throw new Error();
};

export const acceptInvitation = async ({ token, email, invitationId }) => {
  const url = `${apiHost()}/invitation/${invitationId}/accept?email=${email}`;
  const headers = {
    "Girder-Token": token,
  };
  const res = await fetch(url, {
    method: "post",
    mode: "cors",
    headers,
  });
  if (res.ok) return await res.json();
  else throw new Error();
};

export const getInvitation = async ({ token, invitationId }) => {
  const url = `${apiHost()}/invitation/${invitationId}?includeLink=false`;
  const headers = {
    "Girder-Token": token,
  };
  const res = await fetch(url, {
    method: "get",
    mode: "cors",
    headers,
  });
  if (res.ok) return await res.json();
  else throw new Error();
};
