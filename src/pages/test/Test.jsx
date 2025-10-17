import { useEffect, useState } from "react";
import QuizList from "@/components/quiz/QuizList";
import { quizService } from "@/services";

export default function Test() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { id: 1, name: "Math" },
        { id: 2, name: "Science" },
        { id: 3, name: "History" },
        { id: 4, name: "Literature" },
    ];

    useEffect(() => {
        // giả lập API call
        const fetchQuizzes = async () => {
            try {
                const res = await quizService.getAll();
                setQuizzes(res.data); // cập nhật state
                setLoading(false);
                console.log("Quizzes:", res.data);
            } catch (err) {
                console.error("Lỗi khi lấy quiz:", err);
            }
        };
        fetchQuizzes();
    }, []);

    return (
        <div className="p-4">
            <QuizList
                quizzes={quizzes}
                loading={loading}
                categories={categories}
            />
        </div>
    );
}
