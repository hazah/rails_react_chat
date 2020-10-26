import { combineReducers } from '@reduxjs/toolkit'
import * as AUTH from './auth-action-types'
import * as CHAT from './chat-action-types'

const authState = {
  authenticated: !!localStorage.token,
  authenticating: false,
  currentUser: {},
  token: localStorage.token,
  errors: [],
}

function auth(state = authState, action) {
  switch (action.type) {
    case AUTH.REQUEST:
      return {
        ...state,
        authenticating: true,
      }
    case AUTH.SUCCESS:
      return {
        ...state,
        authenticating: false,
        authenticated: true,
        currentUser: action.user,
        token: action.token,
      }
    case AUTH.FAILURE:
      return {
        authenticating: false,
        authenticated: false,
        currentUser: {},
        token: null,
        errors: [...state.errors, action.error] || state.errors,
      }
    case AUTH.LOGOUT:
      return {
        ...state,
        authenticating: false,
        authenticated: false,
        currentUser: {},
        token: null,
      }
    case AUTH.REMOVE_ERRORS:
      return {
        ...state,
        errors: [],
      }
    default:
      return state
  }
}

const chatState = {
  channels: [],
  currentChannel: null,
  messages: [],
}

function chat(state = chatState, action) {
  switch (action.type) {
    case CHAT.CHANNELS_RECIEVED:
      return {
        ...state,
        channels: action.channels,
      }
    case CHAT.CHANNEL_SELECTED:
      return {
        ...state,
        currentChannel: action.channelId
      }
    case CHAT.MESSAGES_RECIEVED:
      return {
        ...state,
        messages: action.messages,
      }
    default:
      return state
  }
}

export default combineReducers({ auth, chat })
