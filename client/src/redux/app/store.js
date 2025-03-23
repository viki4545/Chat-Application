import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import messageReducer from "../features/messageSlice.js"
const store = configureStore({
  reducer: {
    auth: authReducer, 
    message: messageReducer 
  },
});

export default store;
