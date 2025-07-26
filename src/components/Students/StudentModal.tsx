import { useAppDispatch } from "@/redux/hooks";
import { fetchStudents, Student, updateStudent } from "@/redux/studentslice";
import { useState } from "react";
type StudentModalProps = {
    editingStudent: Student;
    setEditingStudent: React.Dispatch<React.SetStateAction<Student | null>>;
};

const StudentModal: React.FC<StudentModalProps> = ({
    editingStudent,
    setEditingStudent,
}) => {
    const [newImage, setNewImage] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    const handleUpdate = async () => {
        if (!editingStudent?.id) return;

        try {
            let imageUrl = editingStudent.imageUrl || "";

            if (newImage) {
                const formData = new FormData();
                formData.append("file", newImage);
                formData.append("upload_preset", "unsigned_students");

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

            // ✅ ابعت البيانات المعدلة + الصورة (لو فيه)
            const updatedData = {
                ...editingStudent,
                imageUrl,
            };

            await dispatch(
                updateStudent({ id: editingStudent.id, data: updatedData })
            ).unwrap();
            dispatch(fetchStudents()); // ⬅️ تحديث القائمة بعد التعديل

            setEditingStudent(null);
            setNewImage(null); // تصفير الصورة
        } catch (err) {
            console.error("Update failed:", err);
        }
    };
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[var(--bg-background)]  p-6 rounded-xl w-full max-w-md shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-[var(--color-accent2)]">
                        Edit Student
                    </h2>

                    <input
                        className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
                        value={editingStudent.name}
                        onChange={(e) =>
                            setEditingStudent({
                                ...editingStudent,
                                name: e.target.value,
                            })
                        }
                    />
                    <input
                        className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
                        value={editingStudent.parentName}
                        onChange={(e) =>
                            setEditingStudent({
                                ...editingStudent,
                                parentName: e.target.value,
                            })
                        }
                    />
                    <input
                        className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
                        value={editingStudent.city}
                        onChange={(e) =>
                            setEditingStudent({
                                ...editingStudent,
                                city: e.target.value,
                            })
                        }
                    />
                    <input
                        className="w-full mb-3 p-2.5 border rounded border-gray-300 outline-none"
                        value={editingStudent.feeStatus}
                        onChange={(e) =>
                            setEditingStudent({
                                ...editingStudent,
                                feeStatus: e.target.value,
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
                            className="px-4 py-1.5 bg-[var(--color-secondary)] text-white rounded hover:bg-[var(--color-primary)] transition-all duration-500 cursor-pointer"
                            onClick={() => setEditingStudent(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-1.5 bg-[var(--color-secondary)] text-white rounded hover:bg-[var(--color-primary)]  transition-all duration-500 cursor-pointer"
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

export default StudentModal;