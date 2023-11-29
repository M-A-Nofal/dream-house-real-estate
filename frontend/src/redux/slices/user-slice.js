import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
    },

    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
    },

    deleteUserSuccess: (state) => {
      state.currentUser = null;
    },

    signOutUserSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} = userSlice.actions;

export default userSlice.reducer;
