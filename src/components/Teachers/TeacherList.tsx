"use client";
import { useEffect, useState } from "react";

import { Edit2, Mail, Phone, Trash2 } from "lucide-react";
import Pagination from "../Nested/Pagination";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import {
  deleteteacher,
  fetchteachers,
  Teacher
} from "@/redux/teacherslice";
import Link from "next/link";
import TeacherModal from "./TeacherModal";

export default function TeachersListPage() {
  const dispatch = useAppDispatch();
  const [editingteacher, setEditingteacher] = useState<Teacher | null>(null);
  const teachers = useAppSelector((state: RootState) => state.teacher.teachers);
  const loading = useAppSelector((state: RootState) => state.teacher.loading);
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const perpage = 12;
  const [currentpage, setcurrentpage] = useState(1);
  const adminEmail = "omar.ayad3040@gmail.com";

  useEffect(() => {
    if (!teachers.length) {
      dispatch(fetchteachers());
    }
  }, [dispatch, teachers.length]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteteacher(id)).unwrap();
      dispatch(fetchteachers()); // ⬅️ تحديث الطلاب من Firestore
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };
  const handleEdit = (student: Teacher) => {
    setEditingteacher(student);
  };
  const totalPage = Math.ceil(teachers.length / perpage);

  const currentTeachers = teachers.slice(
    (currentpage - 1) * perpage,
    currentpage * perpage
  );
  if (loading)
    return (
      <div className="flex items-center justify-center flex-col h-[100vh]">
        <div className="loading"></div>
        <p className="text-[var(--color-accent2)] text-sm mt-2">
          loading Teachers
        </p>
      </div>
    );
  return (
    <div className="mt-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
        {currentTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-[var(--bg-background)] p-4 rounded-lg flex flex-col items-center"
          >
            <div className="bg-gray-200 rounded-full w-20 h-20 mb-4 relative overflow-hidden">
              {teacher.imageUrl && (
                <Link href={`/teachers/${teacher.id}`}>
                  <Image
                    src={teacher.imageUrl}
                    alt={`Profile picture of ${teacher.name}`}
                    loading="lazy"
                    fill
                    className="w-full h-full object-cover"
                  />
                </Link>
              )}
            </div>
            <p className="text-[var(--color-accent2)] text-lg font-bold mb-2">
              {teacher.name}
            </p>
            <p className="text-[var(--color-accent1)] text-sm tracking-wide">
              {teacher.job}
            </p>
            <div className="flex gap-3 items-center mt-5">
              <span className="bg-[var(--color-secondary)] text-[var(--color-accent2)] p-2 rounded-full">
                <Phone size={16} />
              </span>
              <span className="bg-[var(--color-secondary)] text-[var(--color-accent2)] p-2 rounded-full">
                <Mail size={16} />
              </span>
            </div>
            {currentUser?.email === adminEmail && (
              <div className="flex items-center gap-2">
                <button
                  className="bg-gray-100 p-2 rounded-full hover:text-blue-500 transition-all duration-500 cursor-pointer"
                  onClick={() => handleEdit(teacher)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="bg-gray-100 p-2 rounded-full hover:text-red-500 transition-all duration-500 cursor-pointer"
                  onClick={() => handleDelete(teacher.id!)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
        {editingteacher && (
          <TeacherModal
            editingteacher={editingteacher}
            setEditingteacher={setEditingteacher}
          />
        )}
      </div>
      <Pagination
        currentpage={currentpage}
        setcurrentpage={setcurrentpage}
        totalPage={totalPage}
        data={teachers.length}
      />
    </div>
  );
}
