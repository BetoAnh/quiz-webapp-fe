import { useEffect, useState } from "react";
import QuizListHorizon from "@/components/quiz/QuizListHorizon";
import { quizService } from "@/services";

function Home() {
    const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
    const [latestQuizzes, setLatestQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, latestRes] = await Promise.all([
                    quizService.getFeatured(),
                    quizService.getLatest(),
                ]);
                setFeaturedQuizzes(featuredRes.data.data);
                setLatestQuizzes(latestRes.data.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy quiz:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-lg text-gray-600">
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="my-6 text-center text-3xl font-bold">
                Welcome to Quiz App
            </h1>
            <p className="mb-6 text-center text-lg text-gray-700">
                Create, practice, and take quizzes to enhance your knowledge!
            </p>

            <QuizListHorizon
                title="🔥 Quiz nổi bật"
                quizzes={featuredQuizzes}
            />
            <QuizListHorizon
                title="⭐ Quiz mới nhất"
                quizzes={latestQuizzes}
            />
        </div>
    );
}

export default Home;
