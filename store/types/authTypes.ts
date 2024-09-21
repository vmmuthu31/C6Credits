export interface AuthState {
  token: string | null;
  user: User | null;
}

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

interface LoginAction {
  type: typeof LOGIN;
  payload: {
    token: string;
    user: User;
  };
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = LoginAction | LogoutAction;

export interface User {
  id: string;
  email: string;
  usertype: "company" | "offsetter";
}

export const loginAction = (token: string, user: User): AuthActionTypes => ({
  type: LOGIN,
  payload: { token, user },
});

export const logoutAction = (): AuthActionTypes => ({
  type: LOGOUT,
});
