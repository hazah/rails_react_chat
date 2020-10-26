import fetch from "isomorphic-fetch";
import * as AUTH from "./auth-action-types";
import * as CHAT from "./chat-action-types";

const API_URL = "http://localhost:3000";

export function removeErrors() {
  return { type: AUTH.REMOVE_ERRORS };
}

export function authRequest() {
  return { type: AUTH.REQUEST };
}

export function authSuccess(user, token) {
  return {
    type: AUTH.SUCCESS,
    user: user,
    token: token,
  };
}

export function authFailure(error) {
  return {
    type: AUTH.FAILURE,
    error: { type: "auth", error: error, timestamp: new Date() },
  };
}

export function channelsRecieved(channels) {
  return {
    type: CHAT.CHANNELS_RECIEVED,
    channels: channels,
  };
}

export function channelSelected(channelId) {
  return {
    type: CHAT.CHANNEL_SELECTED,
    channelId: channelId,
  };
}

export function messagesRecieved(messages) {
  return {
    type: CHAT.MESSAGES_RECIEVED,
    messages: messages,
  };
}

export function getUser() {
  return fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
}

export function getChannels() {
  return fetch(`${API_URL}/channels`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
}

export function getMessages(channelId) {
  return fetch(`${API_URL}/channels/${channelId}/messages`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
}

export function authenticate(credentials) {
  return (dispatch) => {
    dispatch(authRequest());
    return fetch(`${API_URL}/auth_token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auth: credentials }),
    })
      .then((result) => {
        if (result.ok) {
          return result.json();
        }
        throw new Error("Credentials not found");
      })
      .then((json) => {
        localStorage.setItem("token", json.jwt);
        return getUser();
      })
      .then((user) => {
        console.log(user);
        dispatch(authSuccess(user, localStorage.token));
        return getChannels();
      })
      .then((channels) => {
        console.log(channels);
        dispatch(channelsRecieved(channels));
      })
      .catch((error) => {
        localStorage.clear();
        dispatch(channelsRecieved([]));
        dispatch(authFailure(error));
      });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.clear();
    return dispatch({ type: AUTH.LOGOUT });
  };
}

export function retrieveMessages(channelId) {
  return (dispatch) => {
    return getMessages(channelId).then((messages) => {
      console.log(messages);
      dispatch(messagesRecieved(messages));
    });
  };
}
