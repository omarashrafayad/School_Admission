"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchStudents, deleteStudent, Student } from '@/redux/studentslice'
import { RootState } from '@/redux/store'
import { Edit2, Mail, Phone, Trash2 } from 'lucide-react'
import Pagination from '../Nested/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import StudentMobile from './StudentMobile'
import StudentModal from './StudentModal'

const StudentList = () => {
  const currentUser = useAppSelector((state: RootState) => state.auth.currentUser)
  const dispatch = useAppDispatch()
  const perpage = 6
  const [currentpage, setcurrentpage] = useState(1)
  const { students, loading } = useAppSelector((state: RootState) => state.student)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const adminEmail = "omar.ayad3040@gmail.com";

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteStudent(id)).unwrap()
      dispatch(fetchStudents()) // ⬅️ تحديث الطلاب من Firestore
    } catch (err) {
      console.error('Error deleting student:', err)
    }
  }
  const handleEdit = (student: Student) => {
    setEditingStudent(student)
  }

  const totalPage = Math.ceil(students.length / perpage);

  const currentStudent = useMemo(() => {
    return students.slice(
      (currentpage - 1) * perpage,
      currentpage * perpage
    );
  }, [students, currentpage])

  return (
    <>
      {
        loading ? (
          <div className="flex items-center justify-center flex-col h-[100vh]">
            <div className="loading"></div>
            <p className=" text-[var(--color-accent2)] text-sm mt-2">loading Student</p>
          </div>
        ) : (
          <div className="mt-10 p-2 bg-[var(--bg-background)] rounded-lg">
            {/* عرض الجدول في الشاشات الكبيرة */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border-collapse border rounded-lg overflow-hidden ">
                <thead className=" text-xs text-left">
                  <tr>
                    <th className="p-5">Name</th>
                    <th className="py-5 px-6">Date</th>
                    <th className="p-5">Parent Name</th>
                    <th className="p-5">City</th>
                    <th className="p-5">Contact</th>
                    <th className="p-5">Grade</th>
                    {
                      currentUser?.email === adminEmail && (
                        <th className="p-4">Action</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>

                  {currentStudent.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) :
                    currentStudent.map((student) => (
                      <tr
                        key={student.id}
                        className="border-t border-gray-200 text-sm"
                      >
                        <td className="px-4 py-5 text-[var(--color-accent2)] font-bold flex items-center gap-4">
                          <div className='w-15 h-15 relative'>
                            {student.imageUrl && (
                              <Link href={`/student/${student.id}`}>
                                <Image
                                  src={student.imageUrl}
                                  alt={`Profile picture of ${student.name}`}
                                  loading='lazy'
                                  fill
                                  className="cursor-pointer hover:opacity-80  transition rounded-full object-cover"
                                />
                              </Link>
                            )}
                          </div>
                          {student.name}
                        </td>
                        <td className="px-4 py-5 text-[var(--color-accent1)] max-lg:text-xs">
                          {student.date}
                        </td>
                        <td className="px-4 py-5">{student.parentName}</td>
                        <td className="px-4 py-5 text-[var(--color-accent2)]">
                          {student.city}
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex gap-3 items-center">
                            <span className="bg-[var(--color-secondary)] p-2 rounded-full text-[var(--color-accent2)]">
                              <Phone size={16} />
                            </span>
                            <span className="bg-[var(--color-secondary)] p-2 rounded-full text-[var(--color-accent2)]">
                              <Mail size={16} />
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`p-2 rounded-lg text-white ${student.grade === "A"
                              ? "bg-[#FB7D5B]"
                              : student.grade === "B"
                                ? "bg-[#FCC43E]"
                                : "bg-[#4D44B5]"
                              }`}
                          >
                            {student.grade}
                          </span>
                        </td>
                        {
                          currentUser?.email === adminEmail && (
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-2">
                                <button
                                  className="bg-gray-100 p-2 rounded-full hover:text-blue-500 transition-all duration-500 cursor-pointer"
                                  onClick={() => handleEdit(student)}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  className="bg-gray-100 p-2 rounded-full hover:text-red-500 transition-all duration-500 cursor-pointer"
                                  onClick={() => handleDelete(student.id!)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          )
                        }

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Student In Mobile*/}
            <StudentMobile currentStudent={currentStudent} />

            {/* Pagination */}
            <Pagination
              currentpage={currentpage}
              setcurrentpage={setcurrentpage}
              totalPage={totalPage}
              data={students.length}
            />
          </div>
        )
      }
      {/* ✨ Modal for Edit */}

      {editingStudent && (
        <StudentModal
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
        />
      )}
    </>
  )
}
export default StudentList