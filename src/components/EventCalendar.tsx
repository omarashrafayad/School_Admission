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
import { Calendar, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  addOrUpdateEvent,
  DeleteEvent,
  loadEventsFromStorage,
} from "@/redux/calendarSlice";

// CalendarEvent type
type CalendarEvent = {
  id: string;
  date: string;
  label: string;
  color?: string;
  category?: string;
};

export default function EventCalendar() {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.calendar.events);

  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
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

  const rows = [];
  let days = [];
  let day = startDate;

  const openModal = (date: string) => {
    setSelectedDate(date);
    const existing = events.find((e: CalendarEvent) => e.date === date);
    setNote(existing?.label || "");
    setColor(existing?.color || "");
    setCategory(existing?.category || "");
  };

  const saveNote = () => {
    if (!selectedDate) return;

    const fullDateTime = format(new Date(selectedDate), "yyyy-MM-dd");

    const existing = events.find((e: CalendarEvent) => e.date === fullDateTime);

    dispatch(
      addOrUpdateEvent({
        id: existing?.id || crypto.randomUUID(), // id دايمًا موجود
        date: fullDateTime,
        label: note,
        color,
        category,
      })
    );

    setSelectedDate(null);
    setNote("");
    setColor("");
    setCategory("");
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dateStr = format(day, "yyyy-MM-dd");
      const event = events.find((e: CalendarEvent) => e.date === dateStr);

      days.push(
        <div
          key={dateStr}
          onClick={() => openModal(dateStr)}
          className={clsx(
            "border h-[90px] w-[90px] max-xl:w-[70px] max-xl:h-[70px] max-md:w-[45px] max-md:h-[45px] max-md:p-1 max-md:text-xs p-2 rounded-md text-sm relative transition-all cursor-pointer hover:bg-gray-100",
            !isSameMonth(day, monthStart) &&
            " border border-[var(--color-accent1)] bg-[#f5f5f5]"
          )}
        >
          <div className=" text-[var(--color-accent2)]">{format(day, "d")}</div>
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

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-6">
        {days}
      </div>
    );
    days = [];
  }

return (
    <div className="flex max-lg:flex-col gap-7 items-start overflow-x-auto">
      {/* التقويم */}
      <div className="bg-[var(--bg-background)] p-6 rounded-lg flex-3 max-lg:w-full overflow-x-auto max-md:flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-accent2)]">
            Calendar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-200 text-[var(--color-accent2)] rounded-full transition-all duration-500 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[var(--color-accent2)] text-sm font-medium w-[120px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-200 text-[var(--color-accent2)] rounded-full transition-all duration-500 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* أيام الأسبوع */}
        <div className="grid grid-cols-7 text-center text-xs text-[var(--color-accent1)] mb-4">
          {[...Array(7)].map((_, i) => {
            const dayName = format(
              addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i),
              "EEEE"
            ); // كامل
            const shortName = format(
              addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i),
              "EEE"
            ); // مختصر
            return (
              <div key={i}>
                <span className="hidden sm:inline">{dayName}</span>
                <span className="sm:hidden">{shortName}</span>
              </div>
            );
          })}
        </div>

        {/* الأيام */}
        <div className="flex flex-col gap-3 text-[var(--color-accent1)] max-md:pr-4">
          {rows}
        </div>
      </div>

      {/* قائمة الملاحظات */}
      <div className="flex-1 max-lg:w-full">
        <div className="bg-[var(--bg-background)] p-6 rounded-lg mb-4">
          <h3 className="text-[var(--color-accent2)] text-lg font-bold mb-2">
            Schedule Details
          </h3>
          <p className="text-[var(--color-accent1)] text-xs">
            Thursday, 10th April , 2021
          </p>
        </div>
        {events.length === 0 ? (
          <div className="text-center font-bold text-[var(--color-accent2)] mt-5">
            مفيش ملاحظات
          </div>
        ) : (
          <>
            {events.map((ev: CalendarEvent, idx: number) => (
              <div
                key={idx}
                className="bg-[var(--bg-background)] p-6 rounded-xl mb-4"
                style={{
                  borderLeft: ev.color ?` 16px solid ${ev.color}` : undefined,
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
                    className="text-[var(--color-accent1)] hover:bg-red-500 hover:text-white transition-all duration-500 cursor-pointer bg-gray-200 p-2 rounded-full"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* الـ Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-background)] rounded-lg p-6 min-w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedDate(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 text-[var(--color-accent2)]">
              Add Event for {selectedDate}
            </h3>

            {/* الملاحظة */}
            <label className="block text-sm mb-1.5">Write what happened</label>

            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-5 placeholder:text-sm placeholder:text-[var(--color-accent1)] focus:outline-none"
              placeholder="Describe the note here..."
            />

            {/* اللون */}
            {/* اللون */}
            <div className="mb-5">
              <label className="block text-sm mb-1.5">Event Color</label>
              <div className="flex gap-2">
                {[
                  "var(--color-primary)",
                  "var(--color-orange)",
                  "var(--color-yellow)",
                  "var(--color-accent2)",
                ].map((clr) => (
                  <div
                    key={clr}
                    onClick={() => setColor(clr)}
                    className={clsx(
                      "w-8 h-8 rounded-full cursor-pointer border-[3] transition-all duration-300",
                      color === clr ? "border-[#333]" : "border-transparent"
                    )}
                    style={{ backgroundColor: clr }}
                  ></div>
                ))}
              </div>
            </div>

            {/* التصنيف */}
            <div className="mb-4">
              <label className="block text-sm mb-1.5">Event type</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-5 placeholder:text-sm placeholder:text-[var(--color-accent1)] focus:outline-none"
                placeholder="Work, Study, Occasion..."
              />
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-6 py-1 border border-gray-300 rounded cursor-pointer hover:border-[var(--color-hover)] transition-all duration-500"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-8 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white py-2 rounded transition-all duration-500 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}