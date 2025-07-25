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


interface Chat {
  id: string;
  members: string[];
  lastMessage: string;
  updatedAt: Date | null;
}

interface UserData {
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
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>("User");

  const currentUser = getAuth().currentUser;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 📥 تحميل الشاتات
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

  // 📥 تحميل المستخدمين
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

  // 📥 تحميل رسائل المحادثة
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

  // 📥 جلب اسم الطرف الآخر
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

  // ➕ فتح أو إنشاء شات
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

  // 📤 إرسال رسالة
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
    <div className="flex flex-col md:flex-row rounded-lg bg-[var(--bg-background)]">
      {/* قائمة الشاتات */}
      <div className="w-full md:w-[320px] border-r border-[var(--color-accent3)] max-md:border-none p-4 md:p-6 ">
        <h2 className="text-[var(--color-accent2)] text-lg font-semibold mb-4">
          Messages
        </h2>
        <input
          type="text"
          placeholder="Search here..."
          className="w-full mb-6 px-3 py-2 border border-gray-300 focus:border-gray-500 transition-all duration-300 rounded-full focus:outline-none placeholder:text-sm placeholder:text-[var(--color-accent1)]"
        />
        <h3 className="text-[var(--color-accent1)] font-semibold mb-4 text-sm">
          Chats
        </h3>
        <div className="space-y-3">
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
                  {chats.find((c) => c.members.includes(u.uid))?.lastMessage ||
                    "No messages yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 flex flex-col">
        {activeChatId && currentUser ? (
          <>
            {/* هيدر المحادثة */}
            <div className="p-4 md:p-6 rounded-tr-lg border-b border-[var(--color-accent3)] bg-[var(--bg-background)] flex gap-3 items-center">
              <div className="w-11 h-11 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">
                {otherUserName?.[0] || "U"}
              </div>
              <h3 className="text-[var(--color-accent2)] text-lg font-semibold truncate">
                {otherUserName}
              </h3>
            </div>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-[var(--bg-background)]">
              {messages.length === 0 ? (
                <div className="text-sm text-[var(--color-accent1)] text-center">
                  No Messages Yet
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-3xl text-sm break-words whitespace-pre-wrap max-w-[90%] sm:max-w-[70%] ${
                      msg.senderId === currentUser?.uid
                        ? "bg-[var(--color-primary)] text-white ml-auto"
                        : "bg-gray-400 text-[var(--color-accent2)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* إدخال الرسالة */}
            <div className="p-4 md:p-6 relative rounded-br-lg rounded-bl-lg border-t border-[var(--color-accent3)] bg-[var(--bg-background)] flex items-center max-[430px]:flex-col gap-2">
              <input
                type="text"
                className="flex-1 rounded-full px-4 py-3 border border-gray-300 focus:border-gray-500 transition-all duration-300 focus:outline-none placeholder:text-sm placeholder:text-[var(--color-accent1)]"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message..."
              />
              <button
                onClick={sendMessage}
                className="flex items-center gap-2 px-5 md:px-7 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] transition-all duration-500 cursor-pointer text-white rounded-full"
              >
                <span className="text-sm">Send</span>
                <span>
                  <Send className="rotate-45 w-4 h-4" />
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-3 flex-col text-[var(--color-accent1)] text-sm p-4 text-center">
            <p>Select a conversation to start chatting.</p>
            <p>You must login first to chat friends</p>
          </div>
        )}
      </div>
    </div>
  );
}
