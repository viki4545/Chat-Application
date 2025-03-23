import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getAllUserThunk = createAsyncThunk(
  "chat/getAllUserThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/fetch-all-user`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const messageSlice = createSlice({
  name: "message",
  initialState: {
    users: [],
    messages:[],
    loading: false,
    error: null,
    status: "idle", 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserThunk.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getAllUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users = action.payload.data; 
      })
      .addCase(getAllUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
  },
});

export const { logout } = messageSlice.actions;

export default messageSlice.reducer;
