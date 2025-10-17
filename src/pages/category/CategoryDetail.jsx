import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import QuizList from "@/components/quiz/QuizList";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function CategoryDetail() {
    const { idAndSlug } = useParams();
    const categoryId = idAndSlug.split("-")[0]; // "2-tieng-anh" -> "2"

    const [category, setCategory] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await categoryService.getDetail(categoryId);
            if (res.data.success) {
                setCategory(res.data.data.category);
                setQuizzes(res.data.data.quizzes);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [categoryId]);

    if (loading) return <p className="p-4 text-gray-500">Đang tải...</p>;
    if (!category) return <p className="p-4 text-red-500">Không tìm thấy chuyên mục</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                    {category.description && (
                        <p className="text-gray-600">{category.description}</p>
                    )}
                </div>
            </div>

            {/* Quiz list */}
            <QuizList
                quizzes={quizzes}
                loading={loading}
                updateQuizzes={fetchData}
            />
        </div>
    );
}
