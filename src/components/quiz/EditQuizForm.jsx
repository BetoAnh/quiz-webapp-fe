import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, RadioGroup } from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { quizService } from "@/services";
import { levelService } from "@/services/levelService";
import { categoryService } from "@/services/categoryService";
import toast from "react-hot-toast";

export default function EditQuizForm({ onCancel, quizId: propQuizId }) {
    const navigate = useNavigate();
    const { id: routeQuizId } = useParams();
    const quizId = propQuizId || routeQuizId;

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");


    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [catRes, lvlRes] = await Promise.all([
                    categoryService.getAll(), // cần có API này trong service
                    levelService.getAll(),
                ]);
                setCategories(catRes.data.data || []);
                setLevels(lvlRes.data || []);
            } catch (err) {
                console.error("Lỗi khi tải category/level:", err);
            }
        };
        fetchMeta();
    }, []);

    const renderCategoryOptions = (categories, prefix = "") => {
        return categories.flatMap((cat) => [
            <option key={cat.id} value={cat.id}>
                {prefix + cat.name}
            </option>,
            ...(cat.children?.length
                ? renderCategoryOptions(cat.children, prefix + "— ")
                : []),
        ]);
    };
    // ===== LOAD EXISTING QUIZ =====
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await quizService.getById(quizId);
                const data = res.data;

                // Normalize questions & options
                const mappedQuestions =
                    data.questions?.map((q, i) => ({
                        id: q.id ?? i,
                        text: q.text || "",
                        options: (q.options || []).map((opt, j) =>
                            typeof opt === "string"
                                ? { id: j, text: opt }
                                : { id: opt.id ?? j, text: opt.text || "" }
                        ),
                        correctId:
                            typeof q.correct_id === "number"
                                ? q.correct_id
                                : q.correctIndex ?? 0,
                    })) || [];

                setQuiz({
                    title: data.title || "",
                    description: data.description || "",
                    visibility: data.visibility || "public",
                    questions:
                        mappedQuestions.length > 0
                            ? mappedQuestions
                            : [
                                {
                                    id: 0,
                                    text: "",
                                    options: [{ id: 0, text: "" }],
                                    correctId: 0,
                                },
                            ],
                });
                setSelectedCategory(data.category_id || "");
                setSelectedLevel(data.level_id || "");
            } catch (err) {
                toast.error("Không tải được quiz: " + (err.response?.data?.message || err.message));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    // ===== HANDLERS =====
    const handleQuizChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (qIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].text = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const setCorrectAnswer = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].correctId = oIndex;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const addQuestion = () => {
        const newId = quiz.questions.length;
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                { id: newId, text: "", options: [{ id: 0, text: "" }], correctId: 0 },
            ],
        });
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = quiz.questions.filter((_, i) => i !== qIndex);
        const reIndexed = newQuestions.map((q, i) => ({ ...q, id: i }));
        setQuiz({ ...quiz, questions: reIndexed });
    };

    const addOption = (qIndex) => {
        const newQuestions = [...quiz.questions];
        const nextId = newQuestions[qIndex].options.length;
        newQuestions[qIndex].options.push({ id: nextId, text: "" });
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options
            .filter((_, i) => i !== oIndex)
            .map((opt, i) => ({ ...opt, id: i }));
        if (newQuestions[qIndex].correctId === oIndex) {
            newQuestions[qIndex].correctId = 0;
        }
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const validateQuiz = () => {
        if (!selectedCategory) {
            toast.error("Vui lòng chọn danh mục (Category).");
            return false;
        }

        if (!selectedLevel) {
            toast.error("Vui lòng chọn cấp độ (Level).");
            return false;
        }

        if (quiz.questions.length === 0) {
            toast.error("Quiz phải có ít nhất 1 câu hỏi.");
            return false;
        }

        for (let i = 0; i < quiz.questions.length; i++) {
            if (quiz.questions[i].options.length < 2) {
                toast.error(`Câu ${i + 1} phải có ít nhất 2 đáp án.`);
                return false;
            }
        }
        return true;
    };

    // ===== SUBMIT =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateQuiz()) return;

        try {
            // ✅ Chuẩn hóa trước khi gửi
            const payload = {
                title: quiz.title,
                description: quiz.description,
                visibility: quiz.visibility,
                category_id: selectedCategory || null,
                level_id: selectedLevel || null,
                questions: quiz.questions.map((q) => ({
                    id: q.id,
                    text: q.text,
                    options: q.options.map((opt, i) => ({
                        id: opt.id ?? i,
                        text: opt.text ?? "",
                    })),
                    correctId:
                        typeof q.correctId === "number" ? q.correctId : parseInt(q.correctId) || 0,
                })),
            };

            const res = await quizService.update(quizId, payload);
            toast.success("✅ Quiz cập nhật thành công!");
            navigate(`/quiz/${quizId}`, { replace: true });

        } catch (err) {
            console.error(err);
            toast.error("❌ Lỗi khi cập nhật quiz: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading || !quiz)
        return <div className="p-8 text-gray-600">Đang tải quiz...</div>;

    // ===== RENDER =====
    return (
        <div className="mt-8">
            <form
                onSubmit={handleSubmit}
                className="space-y-8 bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Quiz Info */}
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin quiz</h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {/* Tiêu đề + Hiển thị */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={quiz.title}
                                onChange={handleQuizChange}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Hiển thị
                            </label>
                            <RadioGroup
                                value={quiz.visibility}
                                onChange={(val) => setQuiz({ ...quiz, visibility: val })}
                                className="flex items-center gap-4 mt-1"
                            >
                                {["public", "private"].map((val) => (
                                    <RadioGroup.Option
                                        key={val}
                                        value={val}
                                        className={({ checked }) =>
                                            `cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition 
              ${checked
                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                : "border-gray-300 text-gray-600 hover:border-gray-400"
                                            }`
                                        }
                                    >
                                        {val.charAt(0).toUpperCase() + val.slice(1)}
                                    </RadioGroup.Option>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Mô tả */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                value={quiz.description}
                                onChange={handleQuizChange}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Short description"
                                required
                            />
                        </div>

                        {/* Danh mục + Cấp độ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Danh mục
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {renderCategoryOptions(categories)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Cấp độ
                            </label>
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Chọn cấp độ --</option>
                                {levels.map((group) => (
                                    <optgroup key={group.id} label={group.name}>
                                        {group.children?.map((lvl) => (
                                            <option key={lvl.id} value={lvl.id}>
                                                {lvl.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>


                {/* Questions */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Câu hỏi</h2>
                    {quiz.questions.map((q, qIndex) => (
                        <div
                            key={q.id}
                            className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center">
                                <label className="font-medium text-gray-700">
                                    Câu {qIndex + 1}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={q.text}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nhập câu hỏi"
                                required
                            />

                            <div className="mt-4 space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <div
                                        key={opt.id}
                                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm transition ${q.correctId === oIndex
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-white"
                                            }`}
                                    >
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) =>
                                                handleOptionChange(qIndex, oIndex, e.target.value)
                                            }
                                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder={`Đáp án ${oIndex + 1}`}
                                            required
                                        />
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctId === oIndex}
                                            onChange={() => setCorrectAnswer(qIndex, oIndex)}
                                            className="h-4 w-4 text-indigo-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="mt-3 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
                            >
                                <PlusIcon className="h-4 w-4" /> Thêm đáp án
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="mt-6 flex items-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50 transition"
                    >
                        <PlusIcon className="h-5 w-5" /> Thêm câu hỏi
                    </button>
                </div>

                {/* Submit */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => setShowCancelDialog(true)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                    >
                        Lưu Quiz
                    </button>
                </div>
            </form>

            {/* Cancel Dialog */}
            <Dialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                            Hủy chỉnh sửa quiz?
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-600">
                            Mọi thay đổi chưa lưu sẽ bị mất.
                        </Dialog.Description>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                onClick={() => setShowCancelDialog(false)}
                            >
                                Không
                            </button>
                            <button
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    onCancel?.();
                                }}
                            >
                                Có, hủy bỏ
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
