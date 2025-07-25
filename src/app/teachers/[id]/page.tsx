"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import TopComponent from "@/components/TopComponent";
import { Mail, MapPin, Phone } from "lucide-react";
import { Teacher } from "@/redux/teacherslice";

const TeatcherDetails = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher |null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      const docRef = doc(db, "teachers", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTeacher({ id: docSnap.id, ...docSnap.data() as Teacher});
      }
    };

    if (id) fetchTeacher();
  }, [id]);

  if (!teacher)
    return (
      <div className="flex items-center justify-center flex-col h-screen w-full px-4">
        <div className="loading"></div>
        <p className="text-gray-500 text-sm mt-2">loading Teacher Details</p>
      </div>
    );

  return (
    <div className="bg-[var(--color-secondary)] p-4 sm:p-6 w-full max-w-[950px] mx-auto">
      <TopComponent text={"Teacher Details"} />

      {/* الجزء العلوي */}
      <div className="bg-[var(--color-primary)] relative px-4 sm:px-7 py-10 sm:py-12 rounded-t-lg">
        <div className="border-10 border-[var(--color-yellow)] w-20 h-20 sm:w-50 sm:h-50 rounded-full absolute right-5 sm:right-10 top-5 z-10"></div>
        <div className="border-10 border-[var(--color-orange)] w-20 h-20 sm:w-50 sm:h-50 rounded-full absolute right-16 sm:right-37 top-12 z-5"></div>

        <div className="border-4 border-gray-300 w-20 h-20 sm:w-30 sm:h-30 rounded-full absolute top-8 left-5 sm:left-7 z-50 bg-[var(--bg-background)] overflow-hidden">
          {teacher.imageUrl && (
            <Image
              src={teacher.imageUrl}
              alt={`Profile picture of ${teacher.name}`}
              loading="lazy"
              fill
              className="rounded-full object-cover"
            />
          )}
        </div>
      </div>

      {/* بيانات المدرس */}
      <div className="bg-[var(--bg-background)] p-5 sm:p-7 rounded-b-lg relative z-40">
        <h2 className="mb-2 text-[var(--color-accent2)] text-xl sm:text-2xl font-bold mt-10">
          {teacher.name}
        </h2>
        <p className="text-xs text-[var(--color-accent1)] font-bold">
          {teacher.job} Teacher
        </p>

        {/* معلومات الاتصال */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:space-x-10 my-7 gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
              <MapPin size={19} />
            </span>
            <h3 className="text-[var(--color-accent2)] font-bold">{teacher.city}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
              <Phone size={19} />
            </span>
            <h3 className="text-[var(--color-accent2)] font-bold">{teacher.phone}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[var(--color-orange)] p-1.5 rounded-full text-white">
              <Mail size={19} />
            </span>
            <h3 className="text-[var(--color-accent2)] font-bold">{teacher.email}</h3>
          </div>
        </div>

        {/* باقي التفاصيل */}
        <div className="mb-7">
          <h3 className="text-[var(--color-accent2)] font-bold mb-2">About:</h3>
          <p className="text-sm text-[var(--color-accent2)]">{teacher.about}</p>
        </div>
        <div className="mb-7">
          <h3 className="text-[var(--color-accent2)] font-bold mb-2">Education:</h3>
          <p className="text-sm text-[var(--color-accent2)]">{teacher.education}</p>
        </div>
        <div>
          <h3 className="text-[var(--color-accent2)] font-bold mb-2">Experites:</h3>
          <p className="text-sm text-[var(--color-accent2)]">{teacher.experites}</p>
        </div>
      </div>
    </div>
  );
};

export default TeatcherDetails;
