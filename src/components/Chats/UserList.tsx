import { getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Chat, UserData } from "./Chat";


interface UserlistProps {
    chats: Chat[];
    users: UserData[];
    setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Userlist: React.FC<UserlistProps> = ({ chats, users, setActiveChatId }) => {
    const currentUser = getAuth().currentUser;


    const createOrOpenChat = async (otherUid: string) => {
        if (!currentUser || currentUser.uid === otherUid) return;

        const q = query(
            collection(db, "chat"),
            where("members", "in", [
                [currentUser.uid, otherUid],
                [otherUid, currentUser.uid],
            ])
        );

        const existing = await getDocs(q);
        if (!existing.empty) {
            const chatId = existing.docs[0].id;
            setActiveChatId(chatId);
            return;
        }

        const newChatRef = await addDoc(collection(db, "chat"), {
            members: [currentUser.uid, otherUid],
            updatedAt: new Date(),
            lastMessage: "",
        });

        setActiveChatId(newChatRef.id);
    };
    return (
        <div className="w-full md:w-[320px] bg-[var(--bg-background)] rounded-lg max-md:border-none p-4 md:p-6 mr-5">
            <h2 className="text-[var(--color-accent2)] text-lg font-semibold mb-4">
                Messages
            </h2>
            <h3 className="text-[var(--color-accent1)] font-semibold mb-4 text-sm">
                Chats
            </h3>
            <div className="space-y-3">
                {users.length === 0 ? (
                    <div className="flex items-center justify-center flex-col h-full">
                        <div className="loading"></div>
                        <p className="text-[var(--color-accent2)] text-sm mt-2">
                            loading Users
                        </p>
                    </div>
                ) : (
                    <>
                        {users.map((u) => (
                            <div
                                key={u.uid}
                                onClick={() => createOrOpenChat(u.uid)}
                                className="flex items-center pb-4 cursor-pointer not-last-of-type:border-b border-[var(--color-accent3)]"
                            >
                                <div className="w-11 h-11 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">
                                    {u.name?.[0] || "U"}
                                </div>
                                <div className="ml-3">
                                    <div className="text-[var(--color-accent2)] text-sm font-semibold">
                                        {u.name}
                                    </div>
                                    <div className="truncate max-w-[200px] text-xs text-[var(--color-accent1)]">
                                        {chats.find((c) => c.members.includes(u.uid))
                                            ?.lastMessage || "No messages yet"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Userlist;