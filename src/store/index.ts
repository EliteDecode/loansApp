import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/services/features/auth/authSlice";
import directorReducer from "@/services/features/director/directorSlice";
import managerReducer from "@/services/features/manager/managerSlice";
import agentReducer from "@/services/features/agent/agentSlice";
import clientReducer from "@/services/features/client/clientSlice";
import loanProductReducer from "@/services/features/loanProduct/loanProductSlice";
import loanRequestReducer from "@/services/features/loanRequest/loanRequestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    director: directorReducer,
    manager: managerReducer,
    agent: agentReducer,
    client: clientReducer,
    loanProduct: loanProductReducer,
    loanRequest: loanRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
