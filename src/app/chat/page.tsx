import TopComponent from "@/components/Nested/TopComponent";
import ChatPage from "@/components/Chats/Chat";

const Page = () => {
    return (
        <div className="bg-[var(--color-secondary)] p-6 w-[100vw] ">
            <TopComponent text="Chat" />
            <ChatPage />
        </div>
    );
};

export default Page;