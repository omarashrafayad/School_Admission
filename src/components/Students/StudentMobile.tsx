import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Student } from "@/redux/studentslice";

const StudentMobile = ({ currentStudent }: { currentStudent: Student[] }) => {
    return (
        <div className="grid grid-cols-1 gap-4 p-3 md:hidden">
            {currentStudent.map((student) => (
                <div key={student.id} className="rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative">
                            {student.imageUrl && (
                                <Link href={`/student/${student.id}`}>
                                    <Image
                                        src={student.imageUrl ?? ""}
                                        alt={student.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </Link>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--color-primary)]">
                                {student.name}
                            </h3>
                            <p className="text-xs text-[var(--color-accent1)]">
                                {student.date}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 text-sm">
                        <div className="font-semibold mb-2">
                            Parent:{" "}
                            <span className=" text-[var(--color-accent2)]">
                                {student.parentName}
                            </span>
                        </div>
                        <div className="font-semibold">
                            City:{" "}
                            <span className=" text-[var(--color-accent2)]">
                                {student.city}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="bg-[var(--color-secondary)] p-2 rounded-full text-[var(--color-accent2)]">
                                <Phone size={16} />
                            </span>
                            <span className="bg-[var(--color-secondary)] p-2 rounded-full text-[var(--color-accent2)]">
                                <Mail size={16} />
                            </span>
                        </div>
                        <div className="mt-4 font-semibold">
                            Grade:{" "}
                            <span
                                className={`px-2 py-1 rounded-lg text-white text-xs  ${student.grade === "A"
                                    ? "bg-[#FB7D5B]"
                                    : student.grade === "B"
                                        ? "bg-[#FCC43E]"
                                        : "bg-[#4D44B5]"
                                    }`}
                            >
                                {student.grade}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StudentMobile;