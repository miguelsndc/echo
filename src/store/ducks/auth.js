import { auth } from '../../services/firebase'

// Actions

export const SIGN_OUT = 'echo/auth/SIGN_OUT'
export const LOGIN_WITH_PROVIDER = 'echo/auth/LOGIN_WITH_PROVIDER'
export const GIVE_ERROR_FEEDBACK = 'echo/auth/GIVE_ERROR_FEEDBACK'
export const PERSIST_AUTH_STATE = 'echo/auth/PERSIST_AUTH_STATE'

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
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        error: action.payload.error,
      }
    case GIVE_ERROR_FEEDBACK:
      return {
        ...state,
        error: action.payload,
      }
    case PERSIST_AUTH_STATE:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    default:
      return state
  }
}

// Action Creators

export const signOut = () => ({
  type: SIGN_OUT,
})

export const loginWithProvider = user => ({
  type: LOGIN_WITH_PROVIDER,
  payload: {
    user,
    isAuthenticated: true,
    error: null,
  },
})

export const giveErrorFeedback = error => ({
  type: GIVE_ERROR_FEEDBACK,
  payload: error,
})

// Side effects

export const signOutAsync = () => {
  return async dispatch => {
    await auth.signOut()
    localStorage.removeItem('echo/user')
    dispatch(signOut())
  }
}

export const signInWithProviderAsync = provider => {
  return async dispatch => {
    return auth
      .signInWithPopup(provider)
      .then(results => {
        const { uid, photoURL, displayName } = results.user

        dispatch(
          loginWithProvider({
            uid,
            photoURL,
            displayName,
          })
        )
        localStorage.setItem(
          'echo/user',
          JSON.stringify({ uid, photoURL, displayName })
        )
      })
      .catch(error => dispatch(giveErrorFeedback(error)))
  }
}
