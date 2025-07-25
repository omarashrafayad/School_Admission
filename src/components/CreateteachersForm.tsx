"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addteachers } from "@/redux/teacherslice";

const initialFormData = {
    name: "",
    email: "",
    phone: "",
    job: "",
    about: "",
    education: "",
    experites: "",
    city: "",
    image: null as File | null,
};

const CreateTeacherForm = ({ onClose }: { onClose?: () => void }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            if (formData.image) {
                const formDataCloud = new FormData();
                formDataCloud.append("file", formData.image);
                formDataCloud.append("upload_preset", "unsigned_students");

                const response = await fetch(
                    "https://api.cloudinary.com/v1_1/dqdwjumwk/image/upload",
                    {
                        method: "POST",
                        body: formDataCloud,
                    }
                );

                const data = await response.json();
                imageUrl = data.secure_url;
            }

            const { ...restData } = formData;

            const newTeacher = {
                ...restData,
                education:(restData.education),
                phone: formData.phone.toString(),
                imageUrl,
                createdAt: new Date().toISOString(), // Add createdAt property
            };

            await dispatch(addteachers(newTeacher)).unwrap();

            setFormData(initialFormData);
            onClose?.();
        } catch (error) {
            console.error("❌ Error adding teacher:", error);
        } finally {
            setLoading(false);
        }
    };

return (
        <form
            onSubmit={handleSubmit}
            className="bg-[var(--bg-background)] p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
            />
            <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <input
                name="job"
                placeholder="Job Title"
                value={formData.job}
                onChange={handleChange}
                required
            />
            <input
                name="education"
                placeholder="Education (years)"
                value={formData.education}
                onChange={handleChange}
                type="number"
                required
            />
            <input
                name="experites"
                placeholder="Experience"
                value={formData.experites}
                onChange={handleChange}
                required
            />
            <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
            />
            <input
                name="about"
                placeholder="About"
                value={formData.about}
                onChange={handleChange}
                required
            />
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
                {loading ? "Adding..." : "Add Teacher"}
            </button>
        </form>
    );
};

export default CreateTeacherForm;