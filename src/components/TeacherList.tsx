"use client";
import { useEffect, useMemo, useState } from "react";

import {  Mail, Phone } from "lucide-react";
import Pagination from "./Pagination";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import {  fetchteachers, updateteacher } from "@/redux/teacherslice";
import Link from "next/link";

interface teachers {
  id?: string
  name: string,
  email: string,
  phone: string,
  job: string,
  about: string,
  education: string,
  experites: string,
  city: string,
  createdAt:string | null,
  imageUrl?: string  // ⬅️ الصورة هنا
}
export default function TeachersListPage() {
      const dispatch = useAppDispatch()
      const [newImage, setNewImage] = useState<File | null>(null)

    const [editingteacher, setEditingteacher] = useState<teachers | null>(null)

    const teachers = useAppSelector((state: RootState) => state.teacher.teachers);  
    const loading = useAppSelector((state: RootState) => state.teacher.loading);
    const perpage = 12
    const [currentpage,setcurrentpage] = useState(1)
    const search  = useAppSelector((state: RootState) => state.teacher.search)

  useEffect(() => {
  if (!teachers.length) {
    dispatch(fetchteachers());
  }
}, [dispatch, teachers.length]);

      // const handleDelete = async (id: string) => {
      //   try {
      //     await dispatch(deleteteacher(id)).unwrap()
      //     dispatch(fetchteachers()) // ⬅️ تحديث الطلاب من Firestore
      //   } catch (err) {
      //     console.error('Error deleting student:', err)
      //   }
      // }
      // const handleEdit = (student: teachers) => {
      //   setEditingteacher(student)
      // }
      const handleUpdate = async () => {
      if (!editingteacher?.id) return;
    
      try {
        let imageUrl = editingteacher.imageUrl || '';
    
        if (newImage) {
          const formData = new FormData();
          formData.append("file", newImage);
          formData.append("upload_preset", "unsigned_students");
    
          const response = await fetch("https://api.cloudinary.com/v1_1/dqdwjumwk/image/upload", {
            method: "POST",
            body: formData,
          });
    
          const data = await response.json();
          imageUrl = data.secure_url;
        }
    
        const updatedData = {
          ...editingteacher,
          imageUrl,
        };
    
        await dispatch(updateteacher({ id: editingteacher.id, data: updatedData })).unwrap();
        dispatch(fetchteachers()); // ⬅️ تحديث القائمة بعد التعديل
    
        setEditingteacher(null);
        setNewImage(null); // تصفير الصورة
      } catch (err) {
        console.error("Update failed:", err);
      }
    };
    const filteredStudents = useMemo(() => {
      if (!search) return teachers;
      return teachers.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      );
    }, [teachers, search]);
    
    const totalPage = Math.ceil(filteredStudents.length / perpage);
    
   const currentStudent = filteredStudents.slice(
  (currentpage - 1) * perpage,
  currentpage * perpage
);
    if (loading)
        return (
            <div className="flex items-center justify-center flex-col h-[100vh]">
                <div className="loading"></div>
                <p className="text-gray-500 text-sm mt-2">loading Teachers</p>
            </div>
        );
    return (
        <div className="mt-5">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
                {currentStudent.map((teacher) => (
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
                            <span className="bg-[var(--color-secondary)] text-white p-2 rounded-full">
                                <Phone size={16} />
                            </span>
                            <span className="bg-[var(--color-secondary)] text-white p-2 rounded-full">
                                <Mail size={16} />
                            </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
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
                    </div> */}
                    </div>
                ))}
                  {editingteacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-[var(--color-accent2)]">Edit Student</h2>
            {/* <input
              className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
              value={editingteacher.name}
              onChange={(e) =>
                setEditingteacher({ ...editingteacher, name: e.target.value })
              }
            />
            <input
              className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
              value={editingteacher.email}
              onChange={(e) =>
                setEditingteacher({
                  ...editingteacher,
                  email: e.target.value,
                })
              }
            /> */}
            <input
              className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
              value={editingteacher.about}
              onChange={(e) =>
                setEditingteacher({
                  ...editingteacher,
                  about: e.target.value,
                })
              }
            />
            <input
              className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
              value={editingteacher.education}
              onChange={(e) =>
                setEditingteacher({
                  ...editingteacher,
                  education: e.target.value,
                })
              }
            />
            <input
              className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
              value={editingteacher.experites}
              onChange={(e) =>
                setEditingteacher({
                  ...editingteacher,
                  experites: e.target.value,
                })
              }
            />
            {/* <input
              className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
              value={editingteacher.city}
              onChange={(e) =>
                setEditingteacher({ ...editingteacher, city: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewImage(e.target.files ? e.target.files[0] : null)
              }
            /> */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1.5 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-500 cursor-pointer"
                onClick={() => setEditingteacher(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-500 cursor-pointer"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
            </div>
      <Pagination currentpage={currentpage} setcurrentpage={setcurrentpage} totalPage={totalPage} data = {teachers.length}/>
        </div>
    );
}