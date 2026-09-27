
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RegistrationField = "login" | "register";

interface RegisterState {
  field: RegistrationField;
  email: string;
}

const initialState: RegisterState = {
  field: "login",
  email: "",
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegistrationStep: (state, action: PayloadAction<RegistrationField>) => {
      state.field = action.payload;
    },
    setEmailForRegistration: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetRegistrationFlow: (state) => {
        state.field = "login";
        state.email = "";
    },
  },
});

export const { setRegistrationStep, setEmailForRegistration, resetRegistrationFlow } = registerSlice.actions;

export default registerSlice.reducer;