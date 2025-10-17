import QuizCardMini from "@/components/quiz/QuizCardMini";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function QuizListHorizon({ title, quizzes = [] }) {
    const [isDragging, setIsDragging] = useState(false);
    const [constraints, setConstraints] = useState({ left: 0, right: 0 });
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const updateConstraints = () => {
            if (!containerRef.current || !contentRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const contentWidth = contentRef.current.scrollWidth;

            // Nếu nội dung rộng hơn khung → cho phép kéo
            if (contentWidth > containerWidth) {
                setConstraints({ left: -(contentWidth - containerWidth), right: 0 });
            } else {
                setConstraints({ left: 0, right: 0 });
            }
        };

        updateConstraints();
        window.addEventListener("resize", updateConstraints);
        return () => window.removeEventListener("resize", updateConstraints);
    }, [quizzes]);

    return (
        <div className="w-full mb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base md:text-lg font-semibold">{title}</h2>
            </div>

            {/* Scroll wrapper */}
            <motion.div
                ref={containerRef}
                className="cursor-grab active:cursor-grabbing overflow-hidden"
                whileTap={{ cursor: "grabbing" }}
            >
                <motion.div
                    ref={contentRef}
                    drag="x"
                    dragConstraints={constraints}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
                    className="flex gap-4 px-1"
                >
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz) => (
                            <motion.div
                                key={quiz.id}
                                className="snap-start transition-colors duration-200 hover:bg-gray-50 rounded-xl"
                            >
                                <QuizCardMini quiz={quiz} isDragging={isDragging} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm p-4">
                            Không có quiz nào để hiển thị
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
