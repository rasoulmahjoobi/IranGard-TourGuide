import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.hydrated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    hydrateAuth: (
      state,
      action: PayloadAction<{ user: AuthUser | null; accessToken: string | null }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.hydrated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.hydrated = true;
    },
  },
});

export const { setCredentials, setAccessToken, hydrateAuth, logout } = authSlice.actions;
export default authSlice.reducer;
