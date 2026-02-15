import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";

export const registerUser = createAsyncThunk<
  IUser,
  { email: string; name: string; password: string },
  { rejectValue: string }
>(
  "user/registerUser",
  async ({ email, name, password }, { rejectWithValue }) => {
    try {
      const response = await api.post<{ data: IUser }>("/user", {
        email,
        name,
        password,
      });

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "회원가입 실패",
        );
      }
      return rejectWithValue("회원가입 실패");
    }
  },
);

export const loginWithEmail = createAsyncThunk<
  { user: IUser; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("user/loginWithEmail", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post<{ data: IUser; token: string }>(
      "/user/login",
      {
        email,
        password,
      },
    );

    sessionStorage.setItem("token", response.data.token);

    api.defaults.headers["authorization"] = `Bearer ${response.data.token}`;

    return {
      user: response.data.data,
      token: response.data.token,
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
      return rejectWithValue((error as { error: string }).error);
    }
    return rejectWithValue("로그인 실패");
  }
});

export const loginWithToken = createAsyncThunk<
  IUser,
  void,
  { rejectValue: string }
>("user/loginWithToken", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/user/me");
    return response.data.user;
  } catch (error) {
    if (error && typeof error === "object" && "error" in error) {
      return rejectWithValue((error as { error: string }).error);
    }
    return rejectWithValue("로그인 실패");
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  sessionStorage.removeItem("token");
});

interface IUser {
  _id: string;
  email: string;
  name: string;
  level: string;
}

interface IUserState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  loginError: string | null;
  registrationError: string | null;
  success: boolean;
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  user: null,
  token: sessionStorage.getItem("token"),
  loading: false,
  registrationError: null,
  loginError: null,
  success: false,
  isAuthenticated: !!sessionStorage.getItem("token"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
      state.loginError = null;
      state.registrationError = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.registrationError = null;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload ?? "회원가입 실패";
        state.success = false;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
        state.success = true;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload ?? "로그인 실패";
        state.success = false;
      })
      .addCase(loginWithToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.loginError = null;
        state.registrationError = null;
        state.success = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearErrors, logoutUser } = userSlice.actions;

export default userSlice.reducer;
