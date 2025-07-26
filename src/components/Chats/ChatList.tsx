"use client";

import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    addDoc,
    serverTimestamp,
    DocumentData
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";
import Link from "next/link";

// 🛠️ Types
interface UserData {
    uid: string;
    name: string;
}

interface ChatData {
    id: string;
    members: string[];
    lastMessage: string;
    updatedAt: Date | null;
}

export default function ChatSidebar() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [chats, setChats] = useState<ChatData[]>([]);

    const currentUser = getAuth().currentUser;

    // 📥 جلب الشاتات
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "chat"),
            where("members", "array-contains", currentUser.uid),
            orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList: ChatData[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data() as DocumentData;
                return {
                    id: docSnap.id,
                    members: data.members || [],
                    lastMessage: data.lastMessage || "",
                    updatedAt: data.updatedAt?.toDate?.() ?? null
                };
            });
            setChats(chatList);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // 📥 جلب المستخدمين
    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const list: UserData[] = snapshot.docs
                .map((docSnap) => {
                    const data = docSnap.data() as DocumentData;
                    return {
                        uid: data.uid,
                        name: data.name || ""
                    };
                })
                .filter((u) => u.uid !== currentUser?.uid);

            setUsers(list);
        };

        fetchUsers();
    }, [currentUser]);

    // ➕ إنشاء أو فتح شات
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
            return;
        }

        await addDoc(collection(db, "chat"), {
            members: [currentUser.uid, otherUid],
            updatedAt: serverTimestamp(),
            lastMessage: "",
        });
    };

    return (
        <div className="mb-6">
            <h1 className="text-[var(--color-accent2)] font-bold tracking-wide text-lg mb-5">
                Messages
            </h1>
            <div className="space-y-3">

                {
                    users.length === 0 ? (
                        <div className="flex items-center justify-center flex-col ">
                            <div className="loading"></div>
                            <p className="text-[var(--color-accent2)] text-sm mt-2">loading Users</p>
                        </div>
                    ) :
                        (
                            <>
                                {
                                    users.slice(0, 5).map((u) => (
                                        <div
                                            key={u.uid}
                                            onClick={() => createOrOpenChat(u.uid)}
                                            className="flex items-center p-2 rounded hover:bg-[var(--color-secondary)] cursor-pointer"
                                        >
                                            <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">
                                                {u.name?.[0] || "U"}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-[var(--color-accent2)] font-semibold text-sm">
                                                    {u.name}
                                                </div>
                                                <div className="text-[var(--color-accent1)] text-xs">
                                                    {chats.find((c) => c.members.includes(u.uid))?.lastMessage ||
                                                        "No messages yet"}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                <Link href="/chat" className=" bg-[var(--color-secondary)] shadow-xs hover:bg-[var(--color-accent4)] py-3 rounded-3xl text-[var(--color-accent2)] font-semibold mt-3 cursor-pointer w-full block text-center ">View More</Link>
                            </>

                        )
                }
            </div>

        </div>
    );
}
