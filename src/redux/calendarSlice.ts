import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CalendarEvent = {
    id: string;
    date: string;
    label: string;
    color?: string;
    category?: string;
};

type CalendarState = {
    events: CalendarEvent[];
};

const initialState: CalendarState = {
    events: [],
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setEvents(state, action: PayloadAction<CalendarEvent[]>) {
            state.events = action.payload;
        },
        addOrUpdateEvent(state, action: PayloadAction<CalendarEvent>) {
            const existing = state.events.find((e) => e.id === action.payload.id);
            if (existing) {
                existing.label = action.payload.label;
                existing.color = action.payload.color;
                existing.category = action.payload.category;
                existing.date = action.payload.date;
            } else {
                state.events.push(action.payload);
            }
            localStorage.setItem("calendarEvents", JSON.stringify(state.events));
        },

        loadEventsFromStorage(state) {
            const stored = localStorage.getItem("calendarEvents");
            if (stored) {
                state.events = JSON.parse(stored);
            }
        },
        DeleteEvent(state, action: PayloadAction<string>) {
            state.events = state.events.filter((f) => f.id !== action.payload)
            localStorage.setItem("calendarEvents", JSON.stringify(state.events));
        }
    },
});

export const { setEvents, addOrUpdateEvent, loadEventsFromStorage, DeleteEvent } =
    calendarSlice.actions;
export default calendarSlice.reducer;