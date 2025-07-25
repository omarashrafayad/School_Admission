"use client"

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { UserRound, Users, Wallet } from "lucide-react";
import React from "react";

const DeatailsFinance = () => {
    const students = useAppSelector((state: RootState) => state.student.students)
    const teachers = useAppSelector((state: RootState) => state.teacher.teachers)
    console.log(teachers.length)
    return (
        <div className="flex items-center justify-between gap-5 mb-6 flex-wrap">
            {/* Total Students */}
            <div className="bg-[var(--bg-background)] p-6 rounded-lg flex items-center gap-5 flex-1 ">
                <span className="bg-[var(--color-primary)] rounded-full p-3 text-white">
                    <Users />
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-accent1)] text-sm">
                        Total Students
                    </span>
                    <span className="text-[var(--color-accent2)] font-bold text-2xl">
                        {students.length}
                    </span>
                    <p className="text-[var(--color-accent1)] text-sm">
                        <span className="text-[var(--color-green)] mr-1">+10%</span>
                        than last month
                    </p>
                </div>
            </div>

            {/* Total Teachers */}
            <div className="bg-[var(--bg-background)] p-6 rounded-lg flex items-center gap-5 flex-1">
                <span className="bg-[var(--color-orange)] rounded-full p-3 text-white">
                    <UserRound />
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-accent1)] text-sm">
                        Total Teachers
                    </span>
                    <span className="text-[var(--color-accent2)] font-bold text-2xl">
                        {teachers.length}
                    </span>
                    <p className="text-[var(--color-accent1)] text-sm">
                        <span className="text-[var(--color-red)] mr-1">-0.5%</span>
                        than last month
                    </p>
                </div>
            </div>

            {/* School Balance */}
            <div className="bg-[var(--bg-background)] p-6 rounded-lg flex items-center gap-5 max-[387px]:flex-col flex-2 justify-between ">
                <div className="flex items-center gap-5 flex-[2]">
                    <span className="bg-[var(--color-yellow)] rounded-full p-3 text-white">
                        <Wallet />
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="text-[var(--color-accent1)] text-sm">
                            School Balance
                        </span>
                        <span className="text-[var(--color-accent2)] font-bold text-2xl">
                            $123,456
                        </span>
                        <p className="text-[var(--color-accent1)] text-sm">
                            <span className="text-[var(--color-green)] mr-1">+23%</span>
                            than last month
                        </p>
                    </div>
                </div>

                <svg
                    viewBox="0 0 200 60"
                    xmlns="http://www.w3.org/2000/svg"
                    className=" h-17 flex-2 max-[530px]:h-9"
                >
                    <path
                        d="M0,30 C20,10 40,50 60,30 S100,50 120,30 S160,10 200,30"
                        fill="none"
                        stroke="#16A34A"
                        strokeWidth="3"
                    />
                </svg>
            </div>
        </div>
    );
};

export default DeatailsFinance;