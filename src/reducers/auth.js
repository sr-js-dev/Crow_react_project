import * as types from '../constants/actionTypes';
export const initialState = {
    error: null
}
export default function (state = initialState, action) {
    switch (action.type) {
    case types.FETCH_LOGIN_SUCCESS:
        return { ...state, UserName: action.UserName, UserEmail: action.UserEmail, Role: action.Role, error: null }
    case types.FETCH_LOGIN_FAIL:
        return { ...state, error: action.error }
    case types.FETCH_SERVER_FAIL:
          return { ...state, error: action.error }
    case types.FETCH_BlANK_DATA:
            return { ...state, error: action.error }
    case types.FETCH_LANGUAGE_DATA:
            return { ...state, lang: action.lang }
    default:
        return state
    }
}