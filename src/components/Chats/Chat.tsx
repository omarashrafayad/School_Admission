"use client";

import { useEffect, useRef, useState } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { Send } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Userlist from "./UserList";


export interface Chat {
    id: string;
    members: string[];
    lastMessage: string;
    updatedAt: Date | null;
}

export interface UserData {
    uid: string;
    name: string;
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: Date | null;
}

export default function ChatPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [otherUserName, setOtherUserName] = useState("User");

    const currentUser = getAuth().currentUser;
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const currentUserr = useAppSelector(
        (state: RootState) => state.auth.currentUser
    );

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "chat"),
            where("members", "array-contains", currentUser.uid),
            orderBy("updatedAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const chatList: Chat[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    members: data.members || [],
                    lastMessage: data.lastMessage || "",
                    updatedAt: data.updatedAt?.toDate?.() ?? null,
                };
            });
            setChats(chatList);
        });

        return () => unsub();
    }, [currentUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const list: UserData[] = snapshot.docs
                .map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        uid: data.uid,
                        name: data.name || "",
                    };
                })
                .filter((u) => u.uid !== currentUser?.uid);

            setUsers(list);
        };

        fetchUsers();
    }, [currentUser]);

    useEffect(() => {
        if (!activeChatId) return;

        const messagesRef = collection(db, "chat", activeChatId, "messages");
        const q = query(messagesRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    text: data.text || "",
                    senderId: data.senderId || "",
                    timestamp: data.timestamp?.toDate?.() ?? null,
                };
            });
            setMessages(msgs);
            setTimeout(
                () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
                100
            );
        });

        return () => unsubscribe();
    }, [activeChatId]);

    useEffect(() => {
        const fetchOtherUser = async () => {
            if (!activeChatId || !currentUser) return;

            const chatDoc = await getDoc(doc(db, "chat", activeChatId));
            const data = chatDoc.data();
            if (!data) return;

            const otherUid = data.members.find(
                (uid: string) => uid !== currentUser.uid
            );
            if (!otherUid) return;

            const userDoc = await getDoc(doc(db, "users", otherUid));
            const userData = userDoc.data();
            if (userData?.name) {
                setOtherUserName(userData.name);
            }
        };

        fetchOtherUser();
    }, [activeChatId, currentUser]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeChatId || !currentUser) return;

        await addDoc(collection(db, "chat", activeChatId, "messages"), {
            text: newMessage,
            senderId: currentUser.uid,
            timestamp: serverTimestamp(),
        });

        await setDoc(
            doc(db, "chat", activeChatId),
            {
                lastMessage: newMessage,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        setNewMessage("");
    };

    return (
        <div className="flex flex-col gap-3 md:flex-row min-h-screen">
            {/* قائمة الشاتات */}
            <Userlist chats={chats} users={users} setActiveChatId={setActiveChatId} />

            <div className="flex-1 flex flex-col bg-[var(--bg-background)] rounded-lg">
                {activeChatId && currentUser ? (
                    <>
                        <div className="p-4 md:p-6 rounded-tr-lg rounded-tl-lg border-b border-[var(--color-accent3)] bg-[var(--bg-background)] flex gap-3 items-center">
                            <div className="w-11 h-11 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">
                                {otherUserName?.[0] || "U"}
                            </div>
                            <h3 className="text-[var(--color-accent2)] text-lg font-semibold truncate">
                                {otherUserName}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-[var(--bg-background)]">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-3 rounded-3xl text-sm break-words whitespace-pre-wrap max-w-[90%] sm:max-w-[70%] ${msg.senderId === currentUser?.uid
                                        ? "bg-[var(--color-primary)] text-white ml-auto"
                                        : "bg-[var(--color-secondary)] text-[var(--color-accent2)]"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                        <div className="p-4 md:p-6 relative rounded-br-lg rounded-bl-lg border-t border-[var(--color-accent3)] bg-[var(--bg-background)] flex items-center max-[430px]:flex-col gap-2">
                            <input
                                type="text"
                                className="flex-1 rounded-full px-4 py-3 border border-[var(--color-accent1)] focus:border-[var(--color-primary)] transition-all duration-300 focus:outline-none placeholder:text-sm placeholder:text-[var(--color-accent1)]"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your message..."
                            />
                            <button
                                onClick={sendMessage}
                                className="flex items-center outline-none gap-2 px-5 md:px-7 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] transition-all duration-500 cursor-pointer text-white rounded-full"
                            >
                                <span className="text-sm">Send</span>
                                <span>
                                    <Send className="rotate-45 w-4 h-4" />
                                </span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col gap-3 items-center justify-center text-[var(--color-accent1)] text-sm p-4 text-center">
                        {currentUserr ? (
                            <span>Select a conversation to start chatting.</span>
                        ) : (
                            <span className="text-red-500">You must login to start chatting.</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}