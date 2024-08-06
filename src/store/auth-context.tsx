import { type ReactNode, createContext, useContext, useReducer } from "react";

type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

type Auth = {
  user: User | null;
  isAuthenticated: boolean;
};

type AuthContextValue = Auth & {
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

export function useAuth() {
  const authCtx = useContext(AuthContext);
  if (authCtx === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  if (authCtx === null) throw new Error("AuthContext is null");
  return authCtx;
}

type LoginAction = {
  type: "login";
  payload: User;
};

type LogoutAction = {
  type: "logout";
};

type AuthAction = LoginAction | LogoutAction;

function authReducer(state: Auth, action: AuthAction): Auth {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown Action in AuthContext");
  }
}

const initialValue: Auth = {
  user: null,
  isAuthenticated: false,
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [authState, dispatch] = useReducer(authReducer, initialValue);

  const ctx: AuthContextValue = {
    ...authState,
    login(email, password) {
      if (email === FAKE_USER.email && password === FAKE_USER.password)
        dispatch({ type: "login", payload: FAKE_USER });
      else alert("Not correct");
    },
    logout() {
      dispatch({ type: "logout" });
    },
  };
  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}
