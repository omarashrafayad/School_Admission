'use client'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addStudent } from '@/redux/studentslice'
import { RootState } from '@/redux/store'

const initialFormData = {
  name: '',
  class: '',
  price: '',
  date: '',
  parentName: '',
  city: '',
  grade: '',
  phone: '',
  email: '',
  feeStatus: '',
  image: null as File | null,
}

const CreateStudentForm = ({ }: { onClose?: () => void }) => {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const adminEmail = "omar.ayad3040@gmail.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""

      if (formData.image) {
        const formDataCloud = new FormData()
        formDataCloud.append("file", formData.image)
        formDataCloud.append("upload_preset", "unsigned_students") 

        const response = await fetch("https://api.cloudinary.com/v1_1/dqdwjumwk/image/upload", {
          method: "POST",
          body: formDataCloud,
        })

        const data = await response.json()
        imageUrl = data.secure_url
      }

      const { ...restData } = formData
      const newStudent = {
        ...restData,
        price: parseFloat(formData.price.toString()),
        imageUrl,
      }

      await dispatch(addStudent(newStudent)).unwrap()

      setFormData(initialFormData)
    } catch (error) {
      console.error("❌ Error adding student:", error)
    } finally {
      setLoading(false)
    }
  }
  if (currentUser?.email !== adminEmail) {
    return <div>
      this page Availabe Admin only
    </div>
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--bg-background)] p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <input name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required />
      <input name="class" placeholder="Class" value={formData.class} onChange={handleChange} required />
      <input name="grade" placeholder="Grade" value={formData.grade} onChange={handleChange} required />
      <input name="price" placeholder="Fees" value={formData.price} onChange={handleChange} type="number" required />
      <input name="date" placeholder="Enrollment Date" value={formData.date} onChange={handleChange} type="date" required />
      <input name="parentName" placeholder="Parent Name" value={formData.parentName} onChange={handleChange} required />
      <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
      <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} type="email" required />
      <input name="feeStatus" placeholder="Fee Status" value={formData.feeStatus} onChange={handleChange} required />
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            image: e.target.files ? e.target.files[0] : null,
          }))
        }
      />
      <button
        type="submit"
        disabled={loading}
        className="col-span-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add Student"}
      </button>
    </form>
  )
}

export default CreateStudentForm