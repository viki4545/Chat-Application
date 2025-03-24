import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://chat-application-m8p7.onrender.com";

export const loginUserThunk = createAsyncThunk(
  "auth/loginUserThunk",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "auth/registerUserThunk",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
    status: "idle", 
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.userInfo = action.payload; 
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.userInfo = action.payload; 
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
