import EventCalendar from "@/components/Events/EventCalendar";
import TopComponent from "@/components/Nested/TopComponent";

const EventPage = () => {
    return (
        <div className="bg-[var(--color-secondary)] p-6 w-[100vw]">
            <TopComponent text={"Events"} />
            <EventCalendar />
        </div>
    );
};

export default EventPage;