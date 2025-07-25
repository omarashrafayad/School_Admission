'use client'

import React, { useState } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { addFoods } from '@/redux/foodslice'
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface FoodFormData {
  name: string;
  description: string;
  rate: number;
  total: number;
  interest: number;
  percent: number;
  ingredient: string;
  nurtrition: string;
  mealType: MealType;
  image: File | null;
}

const initialFormData: FoodFormData = {
  name: '',
  description: '',
  rate: 0,
  total: 0,
  interest: 0,
  percent: 0,
  ingredient: '',
  nurtrition: '',
  mealType: 'lunch',
  image: null,
};

const CreateFoodForm = () => {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: ['rate', 'total', 'interest', 'percent'].includes(name) ? Number(value) : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ''

      // ✅ Upload image to Cloudinary if provided
      if (formData.image) {
        const uploadData = new FormData()
        uploadData.append('file', formData.image)
        uploadData.append('upload_preset', 'unsigned_students') // لازم preset يكون unsigned

        const res = await fetch('https://api.cloudinary.com/v1_1/dqdwjumwk/image/upload', {
          method: 'POST',
          body: uploadData,
        })

        const data = await res.json()
        imageUrl = data.secure_url
      }

      const {  ...restData } = formData
      const newFood = { ...restData, imageUrl }

      await dispatch(addFoods(newFood)).unwrap()

      setFormData(initialFormData)
    } catch (error) {
      console.error('❌ Error adding food:', error)
      alert('Error adding food item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-4 bg-[var(--bg-background)] rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-700">Add New Food</h2>

      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />

      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" required />

      <input name="rate" type="number" value={formData.rate} onChange={handleChange} placeholder="Rate" className="w-full border p-2 rounded" />

      <input name="total" type="number" value={formData.total} onChange={handleChange} placeholder="Total" className="w-full border p-2 rounded" />

      <input name="interest" type="number" value={formData.interest} onChange={handleChange} placeholder="Interest" className="w-full border p-2 rounded" />

      <input name="percent" type="number" value={formData.percent} onChange={handleChange} placeholder="Percent" className="w-full border p-2 rounded" />

     <textarea
  name="ingredient"
  value={formData.ingredient}
  onChange={handleChange}
  placeholder="Ingredient Info (each on a new line)"
  className="w-full border p-2 rounded"
  rows={5}
/>


    <textarea
  name="nurtrition"
  value={formData.nurtrition}
  onChange={handleChange}
  placeholder="Nutrition Info (each on a new line)"
  className="w-full border p-2 rounded"
  rows={5}
/>


      <select name="mealType" value={formData.mealType} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </select>

      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Adding...' : 'Add Food'}
      </button>
    </form>
  )
}

export default CreateFoodForm
