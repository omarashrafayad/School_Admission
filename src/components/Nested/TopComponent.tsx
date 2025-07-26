"use client";
import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { AppDispatch, RootState } from "@/redux/store";
import { Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";
import ToggleSwitcher from "./ToggleSwitcher";
import { ToogleMenu } from "@/redux/menuslice";


const TopComponent = ({ text }: { text: string }) => {
    const Menuu = useAppSelector((state: RootState) => state.menu.Menu)
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex items-center justify-between  mb-7 w-full ">
            <h1 className="font-bold text-xl sm:text-2xl text-[var(--color-accent2)]">
                {text}
            </h1>
            <div className="flex items-center gap-5 self-start sm:self-auto">
                <span className=" p-1.5 rounded-4xl text-[var(--color-accent1)] hover:text-white hover:bg-[var(--color-accent2)] transition-all duration-500 cursor-pointer">
                    <ToggleSwitcher />
                </span>
                <span className={`md:hidden cursor-pointer transition-all  duration-500 transform  ${Menuu ? "rotate-90" : "rotate-0"}`} onClick={() => dispatch(ToogleMenu())}>
                    {
                        Menuu ? <X /> : <Menu />
                    }
                </span>
            </div>
        </div>
    );
};

export default TopComponent;