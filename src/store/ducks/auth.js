import { auth } from '../../services/firebase'

// Actions

export const SIGN_OUT = 'echo/auth/SIGN_OUT'
export const LOGIN_WITH_PROVIDER = 'echo/auth/LOGIN_WITH_PROVIDER'
export const GIVE_ERROR_FEEDBACK = 'echo/auth/GIVE_ERROR_FEEDBACK'

// Reducer

const INITIAL_STATE = {
  isAuthenticated: false,
  user: null,
  error: null,
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        error: null,
      }
    case LOGIN_WITH_PROVIDER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      }
    case GIVE_ERROR_FEEDBACK:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

// Action Creators

export const logOut = () => ({
  type: SIGN_OUT,
})

export const loginWithProvider = user => ({
  type: LOGIN_WITH_PROVIDER,
  payload: user,
})

export const giveErrorFeedback = error => ({
  type: GIVE_ERROR_FEEDBACK,
  payload: error,
})

// Side effects

export const signOutAsync = () => {
  return async dispatch => {
    await auth.signOut()
    dispatch(logOut())
  }
}

export const signInWithProviderAsync = provider => {
  return async dispatch => {
    try {
      const results = await auth.signInWithPopup(provider)
      dispatch(loginWithProvider(results.user))
    } catch (error) {
      dispatch(giveErrorFeedback(error))
    }
  }
}