// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import studentReducer from "./studentslice"
import teacherReducer from "./teacherslice"
import foodReducer from "./foodslice"
import calendarReducer from "./calendarSlice"
import menuReducer from "./menuslice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    student:studentReducer,
    teacher:teacherReducer,
    food:foodReducer,
    calendar:calendarReducer,
    menu:menuReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
