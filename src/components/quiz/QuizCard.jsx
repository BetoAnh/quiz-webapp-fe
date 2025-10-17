import { EyeIcon, LockClosedIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

function QuizCard({ quiz, onDelete }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isPublic = quiz.visibility === "public";
    const isOwner = user?.id === quiz.author_id;

    const handleSave = (e) => {
        e.stopPropagation();
        console.log("Save quiz:", quiz.id);
    };

    const handleDownload = (e) => {
        e.stopPropagation();
        const blob = new Blob([quiz.description || "No content"], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${quiz.title || "quiz"}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/quiz/${quiz.id}/edit`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-800">
                    🗑️ Bạn có chắc muốn <b>xóa quiz</b> này không?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            if (onDelete) onDelete(quiz.id);
                        }}
                        className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        ), {
            duration: 4000,
            position: "top-center",
            style: {
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
        });
    };

    return (
        <div
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="rounded-2xl border bg-white shadow-sm p-4 cursor-pointer 
                       hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {quiz.title}
                </h3>

                <div className="flex items-center gap-2">
                    {/* Icon + Tooltip */}
                    <div className="relative group">
                        {isPublic ? (
                            <EyeIcon className="h-5 w-5 text-green-500" />
                        ) : (
                            <LockClosedIcon className="h-5 w-5 text-gray-500" />
                        )}
                        <span className="absolute -top-8 right-1/2 translate-x-1/2 opacity-0 
                                         group-hover:opacity-100 transition bg-black text-white 
                                         text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            {isPublic ? "Public quiz" : "Private quiz"}
                        </span>
                    </div>

                    {/* Menu dấu ba chấm */}
                    <Menu as="div" className="relative">
                        <Menu.Button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleSave}
                                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                            }`}
                                    >
                                        📌 Lưu
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleDownload}
                                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                            }`}
                                    >
                                        ⬇️ Tải xuống (.txt)
                                    </button>
                                )}
                            </Menu.Item>
                            {isOwner && (
                                <>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleEdit}
                                                className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                    }`}
                                            >
                                                ✏️ Chỉnh sửa
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleDelete}
                                                className={`w-full text-left px-4 py-2 text-sm text-red-600 ${active ? "bg-red-50" : ""}`}
                                            >
                                                🗑️ Xóa
                                            </button>

                                        )}
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Items>
                    </Menu>
                </div>
            </div>

            {/* Mô tả */}
            <p
                className="mt-2 text-sm text-gray-600 line-clamp-2"
                style={{
                    minHeight: "calc(1rem * 1.5 * 2)", // giữ luôn 2 dòng chiều cao
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}
            >
                {quiz.description}
            </p>

            {/* Footer */}
            <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
                <span className="px-2 py-1 rounded-lg bg-gray-200 text-gray-900">
                    {quiz.category?.name ? quiz.category.name : "No category"}
                </span>
                <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}

export default QuizCard;
