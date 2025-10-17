// src/components/quiz/UploadQuiz.jsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { quizService } from "@/services/quizService";

export default function UploadQuiz({ onGenerated }) {
    const [file, setFile] = useState(null);
    const [numQuestions, setNumQuestions] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [quizData, setQuizData] = useState(null);
    const [warning, setWarning] = useState(null);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [countdown, setCountdown] = useState(5); // ⏳ 5 giây đếm ngược

    const MAX_FILE_SIZE_MB = 3;
    const MAX_TEXT_CHARS = 50000;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`❌ File vượt quá ${MAX_FILE_SIZE_MB}MB, vui lòng chọn file nhỏ hơn.`);
            setFile(null);
            return;
        }

        setError(null);
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Vui lòng chọn một tệp tài liệu trước.");
            return;
        }

        setLoading(true);
        setError(null);
        setWarning(null);
        setShowWarningModal(false);

        try {
            if (file.type === "text/plain" || file.name.endsWith(".txt")) {
                const text = await file.text();
                if (text.length > MAX_TEXT_CHARS) {
                    setError(`❌ File có hơn ${MAX_TEXT_CHARS.toLocaleString()} ký tự. Vui lòng chọn file ngắn hơn.`);
                    setLoading(false);
                    return;
                }
            }

            const res = await quizService.generateQuiz(file, numQuestions || null);
            const data = res.data;
            console.log("Response from server:", data);            

            if (!data || !data.quiz || !Array.isArray(data.quiz.questions)) {
                throw new Error("Phản hồi từ server không hợp lệ.");
            }

            const quiz = data.quiz;
            setQuizData(quiz);

            let warningMsg = data.warning || null;
            if (numQuestions && quiz.questions.length < Number(numQuestions)) {
                warningMsg = `⚠️ Chỉ tạo được ${quiz.questions.length}/${numQuestions} câu hỏi.`;
            }

            if (warningMsg) {
                setWarning(warningMsg);
                setShowWarningModal(true);
                setCountdown(5); // reset timer
            } else {
                // Không có cảnh báo → vào form luôn
                if (onGenerated) onGenerated(quiz);
            }

        } catch (err) {
            console.error(err);
            setError("❌ Không thể tạo quiz. Vui lòng kiểm tra lại file hoặc server.");
        } finally {
            setLoading(false);
        }
    };

    // 🕒 Xử lý đếm ngược khi modal mở
    useEffect(() => {
        if (showWarningModal && countdown > 0) {
            const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (showWarningModal && countdown === 0) {
            handleProceed();
        }
    }, [showWarningModal, countdown]);

    const handleProceed = () => {
        setShowWarningModal(false);
        if (onGenerated && quizData) onGenerated(quizData);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">
                    🧠 Tạo Quiz từ Tài Liệu
                </h1>

                {/* Upload file */}
                <div className="flex flex-col items-center space-y-3">
                    <input
                        type="file"
                        accept=".txt,.pdf,.docx"
                        onChange={handleFileChange}
                        className="file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                    {file && <p className="text-sm text-gray-600">📄 {file.name}</p>}
                </div>

                {/* Số lượng câu hỏi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng câu hỏi (bỏ trống để AI tự chọn):
                    </label>
                    <input
                        type="number"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        min="1"
                        max="30"
                        placeholder="VD: 10. Tối đa 30"
                        className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`w-full py-2 rounded-xl text-white transition ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "⏳ Đang tạo quiz..." : "🚀 Tạo quiz"}
                </button>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>

            {/* ⚠️ Modal cảnh báo */}
            <Dialog open={showWarningModal} onClose={() => setShowWarningModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="max-w-md w-full bg-white rounded-2xl p-6 shadow-lg text-center">
                        <Dialog.Title className="text-lg font-semibold text-yellow-700 mb-2">
                            ⚠️ Cảnh báo khi tạo Quiz
                        </Dialog.Title>
                        <p className="text-gray-700 mb-4 whitespace-pre-line">{warning}</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Tự động tiếp tục sau {countdown} giây...
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleProceed}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Tiếp tục ngay
                            </button>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
            {loading && (
                <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-700 font-medium text-lg animate-pulse">
                        🤖 AI đang sinh câu hỏi, vui lòng chờ...
                    </p>
                </div>
            )}
        </div>
    );
}
