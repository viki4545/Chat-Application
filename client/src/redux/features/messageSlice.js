import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

export const getAllUserThunk = createAsyncThunk(
  "chat/getAllUserThunk",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/users?search=${searchQuery}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getMessagesThunk = createAsyncThunk(
  "chat/getMessagesThunk",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/${receiverId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessageThunk",
  async ({ sender, receiver, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/chat/send`, {
        sender,
        receiver,
        message,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const markAsReadMessagesThunk = createAsyncThunk(
  "messages/markAsRead",
  async ({ sender, receiver }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/chat/markAsRead`, { sender, receiver });

      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    users: [],
    messages: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
  },
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
      .addCase(getMessagesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.messages.push(action.payload); 
      });
  },
});

export default messageSlice.reducer;
