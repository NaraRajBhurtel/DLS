import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "/features/authSlice"; 
import { authApi } from "/features/api/authApi";
import { courseApi } from "/features/api/courseApi";
import { purchaseApi } from "/features/api/purchaseApi";
import { courseProgressApi } from "/features/api/courseProgressApi";
import { chatApi } from "/features/api/chatApi";
import { liveMeetingApi } from "/features/api/liveMeetingApi"; 
import { discussionApi } from "/features/api/discussionApi";


const rootRedcuer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [liveMeetingApi.reducerPath]: liveMeetingApi.reducer,
    [discussionApi.reducerPath]: discussionApi.reducer,
    auth:authReducer
    
});
export default rootRedcuer;