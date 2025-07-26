import { AppDispatch } from "@/redux/store";
import clsx from "clsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CalendarEvent } from "./EventCalendar";
import { addOrUpdateEvent } from "@/redux/calendarSlice";
import { format } from "date-fns";

type ModalCalendarProps = {
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    note: string;
    setNote: (note: string) => void;
    color: string;
    setColor: (color: string) => void;
    category: string;
    setCategory: (category: string) => void;
    events: CalendarEvent[];
};

const ModalCalendar: React.FC<ModalCalendarProps> = ({
    selectedDate,
    setSelectedDate,
    note,
    setNote,
    color,
    setColor,
    category,
    setCategory,
    events,
}) => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    const saveNote = () => {
        if (!selectedDate) return;
        if (!color) {
            return setMessage("Please select a color for the event");
        }

        const fullDateTime = format(new Date(selectedDate), "yyyy-MM-dd");
        const existing = events.find((e: CalendarEvent) => e.date === fullDateTime);

        dispatch(
            addOrUpdateEvent({
                id: existing?.id || crypto.randomUUID(),
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
    return (
        <>
            <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
                <div className="bg-[var(--bg-background)] rounded-lg p-6 min-w-[400px] max-[400px]:min-w-[300px] relative">
                    <h3 className="text-lg font-bold mb-4 text-[var(--color-accent2)]">
                        Add Event for {selectedDate}
                    </h3>

                    <label className="block text-sm mb-1.5 text-[var(--color-accent2)]">
                        Write what happened
                    </label>
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 mb-5  placeholder:text-sm placeholder:text-[var(--color-accent1)] focus:outline-none"
                        placeholder="Describe the note here..."
                    />

                    <div className="mb-5">
                        <label className="block text-sm mb-1.5 text-[var(--color-accent2)]">
                            Event Color
                        </label>
                        <div className="flex gap-2 mb-1">
                            {[
                                "var(--color-primary)",
                                "var(--color-orange)",
                                "var(--color-yellow)",
                                "var(--color-red)",
                            ].map((clr) => (
                                <div
                                    key={clr}
                                    onClick={() => {
                                        setColor(clr);
                                        setMessage("");
                                    }}
                                    className={clsx(
                                        "w-7 h-7 rounded-full cursor-pointer border-[3] transition-all",
                                        color === clr
                                            ? "border-[var(--color-accent2)]"
                                            : "border-transparent"
                                    )}
                                    style={{ backgroundColor: clr }}
                                ></div>
                            ))}
                        </div>
                        {message && <span className="text-xs text-red-600">{message}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1.5 text-[var(--color-accent2)]">
                            Event type
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded  p-2 mb-5 placeholder:text-sm placeholder:text-[var(--color-accent1)] focus:outline-none"
                            placeholder="Work, Study, Occasion..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="px-6 py-1 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-hover)] transition-all duration-500 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveNote}
                            className="px-8 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white py-1.5 rounded transition-all duration-500 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalCalendar;