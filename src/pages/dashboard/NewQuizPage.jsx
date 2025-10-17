// src/pages/NewQuizPage.jsx
import { useState } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import NewQuizForm from "@/components/quiz/NewQuizForm";
import UploadQuiz from "@/components/quiz/UploadQuiz";

export default function NewQuizPage() {
    const [mode, setMode] = useState(null); // null | "manual" | "ai"
    const [aiQuizData, setAiQuizData] = useState(null);

    const handleAIGenerated = (quiz) => {
        setAiQuizData(quiz);
        setMode("manual"); // 👉 Chuyển sang form thủ công
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Thêm Quiz mới</h1>
            <DashboardTabs />

            <div className="mt-6">
                {/* Nếu chưa chọn mode */}
                {!mode && (
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode("manual")}
                            className="px-5 py-2.5 rounded-lg border text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            ✍️ Tạo thủ công
                        </button>
                        <button
                            onClick={() => setMode("ai")}
                            className="px-5 py-2.5 rounded-lg border text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            🤖 Dùng AI sinh từ tài liệu
                        </button>
                    </div>
                )}

                {/* Nếu đã chọn mode */}
                {mode && (
                    <div>
                        {/* Nút Back */}
                        <button
                            onClick={() => setMode(null)}
                            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            ← Quay lại
                        </button>

                        {mode === "manual" && (
                            <NewQuizForm onCancel={() => setMode(null)} defaultData={aiQuizData} />
                        )}

                        {mode === "ai" && (
                            <UploadQuiz onGenerated={handleAIGenerated} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
