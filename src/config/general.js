import { createSlice } from "@reduxjs/toolkit";
import { getAuth, signOut } from "firebase/auth";

const initialValue = {
  name: "",
  loggedIn: false,
  role: "",
  plan: {},
  chat: false,
  recipient: null,
  chatFocus: "chat",
  lang: "english",
};

const general = createSlice({
  name: "general",
  initialState: initialValue,
  reducers: {
    login: (state, action) => {
      // Update individual properties of the state
      state.name = action.payload.name;
      state.loggedIn = true; // You likely want to set loggedIn to true
      state.role = action.payload.role;
      state.plan = action.payload.plan;
    },

    changeRole: (state, action) => {
      state.role = action.payload.role;

      if(action.payload.plan)
      state.plan = action.payload.plan ;
    },

    logout: (state) => {
      // Update individual properties of the state to log out
      const auth = getAuth();
      signOut(auth);

      state.name = "";
      state.loggedIn = false; // Set loggedIn to false
      state.role = "";
      state.plan = {};
    },

    toggleChat: (state) => {
      state.chat = !state.chat
    },

    setRecipient: (state, action) => {
      state.recipient = action.payload
    },

    setChatFocus: (state, action) => {
      state.chatFocus = action.payload
    },

    setLang: (state, action) => {
      state.lang = action.payload

      console.log(action.payload, "language");
    }

  },
});

export const { login, logout, toggleChat, setRecipient, setChatFocus, setLang } = general.actions;

export default general.reducer;
