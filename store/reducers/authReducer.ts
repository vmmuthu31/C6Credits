import { AuthState, AuthActionTypes, LOGIN, LOGOUT } from "../types/authTypes";

const initialState: AuthState = {
  token: null,
  user: null,
};

export function authReducer(
  state = initialState,
  action: AuthActionTypes
): AuthState {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case LOGOUT:
      return { ...state, token: null, user: null };
    default:
      return state;
  }
}
