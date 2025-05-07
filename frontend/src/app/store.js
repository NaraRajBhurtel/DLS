import {configureStore} from "@reduxjs/toolkit" 
import rootRedcuer from "./rootReducer";
import { authApi } from "/features/api/authApi";
import { courseApi } from "/features/api/courseApi";
import { purchaseApi } from "/features/api/purchaseApi";
import { courseProgressApi } from "/features/api/courseProgressApi";
import { chatApi } from "/features/api/chatApi";
import { liveMeetingApi } from "/features/api/liveMeetingApi";
import { discussionApi } from "/features/api/discussionApi";



export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, 
        courseApi.middleware, 
        purchaseApi.middleware, 
        courseProgressApi.middleware,
        chatApi.middleware,
        liveMeetingApi.middleware,
        discussionApi.middleware,
    
    ),
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}
initializeApp();