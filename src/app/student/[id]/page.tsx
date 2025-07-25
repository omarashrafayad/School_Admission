
"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation"; // أو useRouter في Pages Router
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import TopComponent from "@/components/TopComponent";
import { Mail, MapPin, Phone, TrendingUp, User2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchStudents, Student } from "@/redux/studentslice";
import Pagination from "@/components/Pagination";

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState<Student | null>(null);
    const dispatch = useAppDispatch()
    const perpage = 6
    const [currentpage, setcurrentpage] = useState(1)
    const { students: allStudents, loading } = useAppSelector((state: RootState) => state.student)

    useEffect(() => {
        const fetchStudent = async () => {
            const docRef = doc(db, "students", id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setStudent({ id: docSnap.id, ...docSnap.data() as Student });
            }
        };

        if (id) fetchStudent();
    }, [id]);

    const students = allStudents.slice(0, 21);
      useEffect(() => {
    if (!allStudents.length) {
        dispatch(fetchStudents());
    }
}, [dispatch, allStudents.length])
    
    
        const totalPage = Math.ceil(students.length / perpage);
    
        const currentStudent = useMemo(() => {
            return students.slice(
                (currentpage - 1) * perpage,
                currentpage * perpage
            );
        }, [students, currentpage, perpage])

 if (!student)
    return (
        <div className="flex items-center justify-center flex-col h-screen w-full">
            <div className="loading"></div>
            <p className="text-gray-500 text-sm mt-2">loading Student Details</p>
        </div>
    );

return (
    <div className="bg-[var(--color-secondary)] p-4 sm:p-6 w-full  mx-auto">
        <TopComponent text={"Student Details"} />

        {/* Header Section */}
        <div className="bg-[var(--color-primary)] relative px-5 sm:px-7 py-10 sm:py-12 rounded-t-lg">
            <div className="bg-[var(--color-yellow)] w-16 h-16 sm:w-20 sm:h-20 rounded-lg absolute right-5 sm:right-10 top-5 z-10"></div>
            <div className="bg-[var(--color-orange)] w-16 h-16 sm:w-20 sm:h-20 rounded-lg absolute right-16 sm:right-36 top-14 z-5"></div>

            <div className="border-4 border-gray-300 w-24 h-24 rounded-full absolute top-8 left-5 sm:left-7 z-50 bg-[var(--bg-background)] overflow-hidden">
                {student.imageUrl && (
                    <Image
                        src={student.imageUrl}
                        alt={`Profile photo of ${student.name}`}
                        loading="lazy"
                        fill
                        className="rounded-full object-cover"
                    />
                )}
            </div>
        </div>

        {/* Student Info */}
        <div className="bg-[var(--bg-background)] p-5 sm:p-7 rounded-b-lg relative z-40">
            <h2 className="mb-2 text-[var(--color-accent2)] text-xl sm:text-2xl font-bold mt-10">
                {student.name}
            </h2>
            <p className="text-xs text-[var(--color-accent1)] font-bold">Student</p>

            <div className="flex flex-col sm:flex-wrap sm:flex-row items-start sm:items-center gap-5 sm:gap-3 justify-between mt-7">
                {/* Parents */}
                <div>
                    <p className="text-sm text-[var(--color-accent1)]">Parents:</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
                            <User2 size={19} />
                        </span>
                        <h3 className="text-[var(--color-accent2)] font-bold">
                            {student.parentName}
                        </h3>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <p className="text-sm text-[var(--color-accent1)]">Address:</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
                            <MapPin size={19} />
                        </span>
                        <h3 className="text-[var(--color-accent2)] font-bold">
                            {student.city}
                        </h3>
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <p className="text-sm text-[var(--color-accent1)]">Phone:</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
                            <Phone size={19} />
                        </span>
                        <h3 className="text-[var(--color-accent2)] font-bold">
                            {student.phone}
                        </h3>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <p className="text-sm text-[var(--color-accent1)]">Email:</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
                            <Mail size={19} />
                        </span>
                        <h3 className="text-[var(--color-accent2)] font-bold">
                            {student.email}
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        {/* Expense Section */}
        <div>
            {loading ? (
                <div className="flex items-center justify-center flex-col h-full">
                    <div className="loading"></div>
                    <p className="text-gray-500 text-sm mt-2">loading Student</p>
                </div>
            ) : (
                <div className="p-4 sm:p-5 bg-[var(--bg-background)] rounded-lg mt-7  ">
                    <h1 className="font-bold text-lg text-[var(--color-accent2)]">
                        Student Expense
                    </h1>

                    {currentStudent.length === 0 ? (
    <p className="text-center text-gray-500 mt-4">No expenses found.</p>
) : 
    currentStudent.slice(0, 10).map((student) => (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-[2.5fr_2fr_1.5fr_1fr] gap-4 items-center mt-5 sm:mt-7 max-md:shadow-sm p-3"
                            key={student.id}
                        >
                            <div className="flex items-center gap-4">
                                <span className="bg-[var(--color-red)] rounded-full p-3 text-white">
                                    <TrendingUp size={22} />
                                </span>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-[var(--color-accent2)] font-bold">
                                        {student.name}
                                    </span>
                                    <span className="text-sm text-[var(--color-accent1)]">
                                        {student.city}
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm text-[var(--color-accent2)] font-bold">{student.date}</div>
                            <div className="text-sm text-[var(--color-accent2)] font-bold">${student.price}</div>
                            <div>
                                {student.feeStatus === "Paid" ? (
                                    <span className="text-sm font-semibold text-[var(--color-green)]">complete</span>
                                ) : (
                                    <span className="text-sm font-semibold text-[var(--color-red)]">canceled</span>
                                )}
                            </div>
                        </div>
                    ))}

                    <Pagination
                        currentpage={currentpage}
                        setcurrentpage={setcurrentpage}
                        totalPage={totalPage}
                        data={students.length}
                    />
                </div>
            )}
        </div>
    </div>
);
};

export default StudentDetails;