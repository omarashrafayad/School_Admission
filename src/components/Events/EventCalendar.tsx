"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { loadEventsFromStorage } from "@/redux/calendarSlice";
import NotesList from "./NotesList";
import ModalCalendar from "./ModalCalender";

export type CalendarEvent = {
  id: string;
  date: string;
  label: string;
  color?: string;
  category?: string;
};

export default function EventCalendar() {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.calendar.events);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(loadEventsFromStorage());
  }, [dispatch]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  const openModal = (date: string) => {
    setSelectedDate(date);
    const existing = events.find((e: CalendarEvent) => e.date === date);
    setNote(existing?.label || "");
    setColor(existing?.color || "");
    setCategory(existing?.category || "");
  };

  // Generate days grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dateStr = format(day, "yyyy-MM-dd");
      const event = events.find((e: CalendarEvent) => e.date === dateStr);

      days.push(
        <div
          key={dateStr}
          onClick={() => openModal(dateStr)}
          className={clsx(
            "border h-[90px] w-[90px] max-xl:w-[70px] max-xl:h-[70px] max-md:w-[45px] max-md:h-[45px] max-md:p-1 max-md:text-xs p-2 rounded-md text-sm relative transition-all cursor-pointer hover:bg-[var(--color-secondary)]",
            !isSameMonth(day, monthStart) &&
              " border border-[var(--color-accent1)] bg-[var(--color-secondary)]"
          )}
        >
          <div className="text-[var(--color-accent2)]">{format(day, "d")}</div>
          {event?.label && (
            <div
              className="text-xs border-l-2 max-md:pl-1 pl-2 lg:mt-2 truncate"
              style={{ borderColor: event.color || "#f59e0b" }}
            >
              {event.label}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
  }

  return (
    <div className="flex max-lg:flex-col gap-7 items-start ">
      {/* Calendar */}
      <div className="bg-[var(--bg-background)] shadow p-6 rounded-lg flex-3 max-lg:w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-accent2)]">
            Calendar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1 hover:bg-[var(--color-secondary)] text-[var(--color-accent2)] rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[var(--color-accent2)] text-sm font-medium w-[120px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1 hover:bg-[var(--color-secondary)] text-[var(--color-accent2)] rounded-full transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week days + Days */}
        <div className="grid grid-cols-7 gap-3 min-w-max overflow-x-auto">
          {[...Array(7)].map((_, i) => {
            const dayName = format(
              addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i),
              "EEE"
            );
            return (
              <div
                key={i}
                className=" text-xs font-semibold text-[var(--color-accent1)]"
              >
                {dayName}
              </div>
            );
          })}
          {days}
        </div>
      </div>

      {/*Note List */}
      <NotesList events={events} />
      {/* Modal */}
      {selectedDate && (
        <ModalCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          color={color}
          setColor={setColor}
          events={events}
          note={note}
          setNote={setNote}
          category={category}
          setCategory={setCategory}
        />
      )}
    </div>
  );
}
