import { useEffect, useState, useCallback } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import QuizList from "@/components/quiz/QuizList";
import { quizService } from "@/services";

export default function MyQuizzes() {
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await quizService.myquizzes();

            if (Array.isArray(res.data)) {
                const sorted = [...res.data].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setQuizzes(sorted);
            }
        } catch (err) {
            console.error("Error fetching quizzes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔹 Gọi fetchData khi component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="w-full max-w-6xl mx-auto py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz của tôi</h1>
            <DashboardTabs />

            <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                <QuizList quizzes={quizzes} loading={loading} updateQuizzes={fetchData} />
            </div>
        </div>
    );
}
