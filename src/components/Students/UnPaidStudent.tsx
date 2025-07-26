"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchStudents } from "@/redux/studentslice";
import { User2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../Nested/Pagination";
import Link from "next/link";
import Image from "next/image";

const perPage = 5;
const UnPaidStudent = () => {
    const { students, loading } = useSelector((state: RootState) => state.student);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);
    const unPaidStudents = useMemo(
        () => students.filter((student) => student.feeStatus === "Unpaid"),
        [students]
    );

    const totalPage = Math.ceil(unPaidStudents.length / perPage);

    const currentStudent = useMemo(() => {
        return unPaidStudents.slice(
            (currentPage - 1) * perPage,
            currentPage * perPage
        );
    }, [unPaidStudents, currentPage]);
    return (
        <div className="bg-[var(--bg-background)] mt-6 rounded-lg p-5 lg:min-h-[750px]">
            <h1 className="font-bold text-lg text-[var(--color-accent2)]">
                Unpaid student Intuition
            </h1>
            {loading ? (
                <div className="flex items-center justify-center flex-col h-[75vh]">
                    <div className="loading"></div>
                    <p className="text-[var(--color-accent2)]text-sm mt-2">loading Student</p>
                </div>
            ) :
                currentStudent.map((student) => (
                    <div
                        key={student.id}
                        className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1.5fr_1fr] items-center gap-4 mt-7 p-3 bg-[var(--bg-background)] rounded-lg max-md:shadow-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-15 h-15 flex-shrink-0 ">
                                {student.imageUrl && (
                                    <Link href={`/student/${student.id}`}>
                                        <Image
                                            src={student.imageUrl}
                                            alt={student.name}
                                            fill
                                            aria-label={`View profile of ${student.name}`}
                                            loading="lazy"
                                            className="cursor-pointer hover:opacity-80 transition-all duration-500 rounded-full object-cover"
                                        />
                                    </Link>
                                )}
                            </div>
                            <h3 className="text-[var(--color-accent2)] font-bold">
                                {student.name}
                            </h3>
                        </div>
                        <span className="text-[var(--color-accent2)]">{student.city}</span>
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-[var(--color-orange)] rounded-full text-white" aria-label="Student class icon">
                                <User2 size={22} aria-hidden="true" />
                            </span>
                            <div className="flex flex-col ">
                                <span className="text-sm text-[var(--color-accent1)] mb-0.5 tracking-wide">
                                    Class
                                </span>
                                <span className="text-sm text-[var(--color-accent2)] font-bold tracking-wide" aria-label={`Unpaid tuition: $${student.price}`}>
                                    {student.class}
                                </span>
                            </div>
                        </div>
                        <span className="text-[var(--color-accent2)] font-bold">
                            $ {student.price}
                        </span>

                    </div>
                ))}
            <Pagination
                currentpage={currentPage}
                setcurrentpage={setCurrentPage}
                totalPage={totalPage}
                data={unPaidStudents.length}
            />
        </div>
    );
};

export default React.memo(UnPaidStudent);