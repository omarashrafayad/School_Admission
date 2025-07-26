import { useAppDispatch } from "@/redux/hooks";
import { fetchteachers, Teacher, updateteacher } from "@/redux/teacherslice";
import { useState } from "react";

type TeacherModelProps = {
    editingteacher: Teacher;
    setEditingteacher: React.Dispatch<React.SetStateAction<Teacher | null>>;
};

const TeacherModal: React.FC<TeacherModelProps> = ({
    editingteacher,
    setEditingteacher,
}) => {
    const [newImage, setNewImage] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    const handleUpdate = async () => {
        if (!editingteacher?.id) return;

        try {
            let imageUrl = editingteacher.imageUrl || "";

            if (newImage) {
                const formData = new FormData();
                formData.append("file", newImage);
                formData.append("upload_preset", "teachers");

                const response = await fetch(
                    "https://api.cloudinary.com/v1_1/dqdwjumwk/image/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const data = await response.json();
                imageUrl = data.secure_url;
            }

            const updatedData = {
                ...editingteacher,
                imageUrl,
            };

            await dispatch(
                updateteacher({ id: editingteacher.id, data: updatedData })
            ).unwrap();
            dispatch(fetchteachers());

            setEditingteacher(null);
            setNewImage(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-[var(--color-accent2)]">
                        Edit Student
                    </h2>
                    <input
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
                    />
                    <input
                        className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
                        value={editingteacher.city}
                        onChange={(e) =>
                            setEditingteacher({ ...editingteacher, city: e.target.value })
                        }
                    />
                    <textarea
                        className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
                        value={editingteacher.about}
                        rows={5}
                        onChange={(e) =>
                            setEditingteacher({ ...editingteacher, about: e.target.value })
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
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setNewImage(e.target.files ? e.target.files[0] : null)
                        }
                    />

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
        </>
    );
};

export default TeacherModal;
