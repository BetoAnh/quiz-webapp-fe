import {
    EyeIcon,
    LockClosedIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function QuizCardMini({ quiz, isDragging = false }) {
    const navigate = useNavigate();
    const isPublic = quiz.visibility === "public";

    const handleClick = () => {
        if (isDragging) return; // ⛔ bỏ qua click khi đang kéo
        navigate(`/quiz/${quiz.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="relative min-w-[250px] max-w-[250px] bg-white border rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200"
        >
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                {isPublic ? (
                    <EyeIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                )}
            </div>

            <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mr-12">
                    {quiz.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">
                    {quiz.description}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                    {quiz.category?.name || "Không có danh mục"}
                </p>
            </div>
        </div>
    );
}
