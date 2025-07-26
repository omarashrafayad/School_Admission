"use client";

import { logout } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ToogleMenu } from "@/redux/menuslice";
import { RootState } from "@/redux/store";
import {
    Activity,
    Calendar,
    Home,
    LogIn,
    LogOut,
    MessageCircle,
    Pizza,
    UserRound,
    Users,
    Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { id: 1, label: "Dashboard", icon: <Home />, path: "/" },
    { id: 2, label: "Students", icon: <Users />, path: "/student" },
    { id: 3, label: "Teachers", icon: <UserRound />, path: "/teachers" },
    { id: 4, label: "Event", icon: <Calendar />, path: "/events" },
    { id: 5, label: "Finance", icon: <Wallet />, path: "/finance" },
    { id: 6, label: "Food", icon: <Pizza />, path: "/food" },
    { id: 8, label: "Chat", icon: <MessageCircle />, path: "/chat" },
    { id: 9, label: "Lastest Activity", icon: <Activity />, path: "/lastestactivity" },
];

const Sidebar = () => {
    const Menuu = useAppSelector((state: RootState) => state.menu.Menu);
    const currentUser = useAppSelector((state: RootState) => state.auth.currentUser)
    const pathname = usePathname();
    const dispatch = useAppDispatch()

    return (
        <>
            {Menuu && (
                <div
                    className="fixed inset-0 bg-black/40 w-screen md:hidden z-100"
                    onClick={() => dispatch(ToogleMenu())}
                />
            )}
            <aside
                className={`
                bg-[var(--color-primary2)] w-64 min-h-screen text-white z-1000
                fixed top-0 left-0 transition-transform duration-1000 
                ${Menuu ? "translate-x-0" : "-translate-x-full"}
                md:static md:translate-x-0
            `}
            >
                <div className="flex items-center justify-center text-white gap-3 p-6 mb-5">
                    <span className="bg-[var(--color-orange)] rounded-lg h-9 w-9 flex items-center justify-center font-semibold text-xl">
                        A
                    </span>
                    <h1 className="text-3xl font-bold">Akademi</h1>
                </div>
                <nav className="ml-5">
                    <ul className="flex flex-col gap-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <li
                                    key={item.id}
                                    onClick={() => dispatch(ToogleMenu())}
                                    className={`p-2 rounded-tl-lg rounded-bl-lg ${isActive
                                        ? "bg-[var(--color-secondary)] text-[var(--color-accent2)]"
                                        : "text-white"
                                        }`}
                                >
                                    <Link href={item.path} className="flex items-center cursor-pointer outline-none hover:scale-110 transition-all duration-500">
                                        <span className="w-8 h-8 mr-3 mt-1 ml-1.5">{item.icon}</span>
                                        <span className="text-sm ">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        {
                            currentUser ? (
                                <li
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(ToogleMenu());
                                        dispatch(logout());
                                        window.location.href = "/";
                                    }}
                                    className="p-2 rounded-tl-lg rounded-bl-lg"
                                >
                                    <span className="flex items-center cursor-pointer outline-none">
                                        <span className="w-8 h-8 mr-3 mt-1"><LogOut /></span>
                                        <span className="text-sm">LogOut</span>
                                    </span>
                                </li>
                            ) : (
                                <li
                                    onClick={() => dispatch(ToogleMenu())}
                                    className={`p-2 rounded-tl-lg rounded-bl-lg ${pathname === `/login`
                                        ? "bg-[var(--color-secondary)] text-[var(--color-accent2)]"
                                        : "text-white"
                                        }`}
                                >
                                    <Link href="/login" className="flex items-center cursor-pointer outline-none">
                                        <span className="w-8 h-8 mr-3 mt-1 "><LogIn /></span>
                                        <span className="text-sm ">LogIn</span>
                                    </Link>
                                </li>
                            )
                        }

                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;