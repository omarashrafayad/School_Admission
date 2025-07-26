import React from 'react'
import { CalendarEvent } from './EventCalendar';
import { Calendar, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { DeleteEvent } from '@/redux/calendarSlice';
const today = new Date();

const formatted = today.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const NotesList = ({ events }: { events: CalendarEvent[] }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (

    <div className="flex-1 max-lg:w-full">
      <div className="bg-[var(--bg-background)] p-6 rounded-lg mb-4">
        <h3 className="text-[var(--color-accent2)] text-lg font-bold mb-2">
          Schedule Details
        </h3>
        <p className="text-[var(--color-accent1)] text-xs">
          {formatted}
        </p>
      </div>
      {events.length === 0 ? (
        <div className="flex flex-col gap-1 text-center font-bold text-[var(--color-accent2)] mt-6">
          <span className="text-lg">No notes found</span>
          <span className="text-sm text-[var(--color-accent1)]">
            Please add a note
          </span>
        </div>
      ) : (
        events.map((ev: CalendarEvent) => (
          <div
            key={ev.id}
            className="bg-[var(--bg-background)] p-6 rounded-xl mb-4"
            style={{
              borderLeft: ev.color ? `16px solid ${ev.color}` : undefined,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-4">
                  <h4 className="text-[var(--color-accent2)] text-sm font-semibold mb-0.5">
                    {ev.label}
                  </h4>
                  {ev.category && (
                    <p className="text-[var(--color-accent1)] text-xs">
                      {ev.category}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-orange)]">
                    <Calendar size={15} />
                  </span>
                  <span className="text-xs text-[var(--color-accent1)]">
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => dispatch(DeleteEvent(ev.id))}
                className="text-[var(--color-accent2)] hover:bg-red-500 hover:text-white transition-all bg-[var(--color-secondary)] p-2 rounded-full cursor-pointer duration-300"
              >
                <Trash2 size={19} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default NotesList
