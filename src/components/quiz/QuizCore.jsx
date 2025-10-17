import { useState, useEffect } from 'react'
import { decryptData, encryptData } from '@/utils/cryptoStorage'

function Question({ question, selectedId, onAnswer, mode }) {
    return (
        <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
            <div className="space-y-2">
                {question.options.map((option) => {
                    let bgClass = 'bg-gray-100 hover:bg-gray-200'

                    if (mode === "practice") {
                        if (selectedId !== null && selectedId !== undefined) {
                            if (option.id === selectedId) {
                                bgClass =
                                    option.id === question.correct_id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                            } else if (
                                selectedId !== question.correct_id &&
                                option.id === question.correct_id
                            ) {
                                bgClass = 'bg-green-500 text-white'
                            }
                        }
                    } else if (mode === "exam") {
                        if (option.id === selectedId) {
                            bgClass = 'bg-blue-500 text-white'
                        }
                    }

                    return (
                        <button
                            key={option.id}
                            onClick={() => onAnswer(option.id)}
                            className={`block w-full text-left px-4 py-2 rounded border ${bgClass}`}
                        >
                            {option.text}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default function QuizCore({ quiz, storageKey, onAnswerSelect, mode }) {
    const stateKey = storageKey + '-state'

    const [currentIndex, setCurrentIndex] = useState(() => {
        try {
            const stored = decryptData(sessionStorage.getItem(stateKey))
            return stored?.currentIndex ?? 0
        } catch {
            return 0
        }
    })

    const [selectedIds, setSelectedIds] = useState(() => {
        try {
            const stored = decryptData(sessionStorage.getItem(stateKey))
            if (stored?.answers && Array.isArray(stored.answers)) {
                return stored.answers.map((a) => a.selectedId)
            }
        } catch { }
        return Array(quiz.questions.length).fill(null)
    })

    useEffect(() => {
        try {
            const stored = decryptData(sessionStorage.getItem(stateKey)) || {}
            const newState = {
                answers: selectedIds.map((id) => ({ selectedId: id })),
                currentIndex,
                startTime: stored.startTime ?? Date.now(),
            }
            sessionStorage.setItem(stateKey, encryptData(newState))
        } catch (err) {
            console.error('Error saving state:', err)
        }
    }, [selectedIds, currentIndex, stateKey])

    const handleAnswer = (optionId) => {
        if (mode === "practice") {
            // Nếu đã chọn rồi thì bỏ qua
            if (selectedIds[currentIndex] !== null && selectedIds[currentIndex] !== undefined) {
                return
            }
        }

        // Cập nhật bình thường (cho cả practice lần đầu, và exam mọi lúc)
        const newSelected = [...selectedIds]
        newSelected[currentIndex] = optionId
        setSelectedIds(newSelected)

        if (onAnswerSelect) onAnswerSelect(currentIndex, optionId)
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Bọc trong flex có responsive direction */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Câu hỏi */}
                <div className="flex-1">
                    <Question
                        question={quiz.questions[currentIndex]}
                        selectedId={selectedIds[currentIndex]}
                        onAnswer={handleAnswer}
                        mode={mode}
                    />
                </div>

                {/* Navigator */}
                <div
                    className={`
                        grid gap-2
                        grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))]
                        overflow-y-auto
                        max-h-[calc(2.5rem*4+0.5rem*3)]  
                        md:pr-2
                        md:grid-cols-4 md:self-start
                        md:max-h-[calc(2.5rem*7+0.5rem*6)]  
                    `}
                >

                    {quiz.questions.map((_, idx) => {
                        let bgClass = 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        const selectedId = selectedIds[idx]

                        if (mode === "practice") {
                            if (selectedId !== null && selectedId !== undefined) {
                                if (selectedId === quiz.questions[idx].correct_id)
                                    bgClass = 'bg-green-200 border-green-400'
                                else bgClass = 'bg-red-200 border-red-400'
                            }

                            if (idx === currentIndex) {
                                if (selectedId === quiz.questions[idx].correct_id)
                                    bgClass = 'bg-green-500 border-green-600 text-white'
                                else if (
                                    selectedId !== null &&
                                    selectedId !== undefined &&
                                    selectedId !== quiz.questions[idx].correct_id
                                )
                                    bgClass = 'bg-red-500 border-red-600 text-white'
                                else bgClass = 'bg-indigo-600 text-white border-indigo-700'
                            }
                        } else if (mode === "exam") {
                            if (idx === currentIndex) {
                                bgClass = 'bg-indigo-600 text-white border-indigo-700'
                            } else if (selectedId !== null && selectedId !== undefined) {
                                bgClass = 'bg-yellow-300 border-yellow-500'
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-10 h-10 flex items-center justify-center rounded border font-semibold ${bgClass}`}
                            >
                                {idx + 1}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
