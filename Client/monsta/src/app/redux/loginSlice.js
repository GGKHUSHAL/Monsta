import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';
export const loginSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get("token") || null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      Cookies.set("token", state.token, { expires: 7 }); // Store token in cookies for 7 days
    },
    logOut: (state) => {
      state.token = null;
      Cookies.remove("token"); // Remove token from cookies on logout
    }
  },
})

export const { setToken, logOut } = loginSlice.actions

export default loginSlice.reducer