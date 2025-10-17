import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import QuizCore from '@/components/quiz/QuizCore'
import { decryptData, encryptData } from '@/utils/cryptoStorage'

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function PracticeQuiz() {
    const location = useLocation()
    const { storageKey } = location.state || {}

    const [quiz, setQuiz] = useState(null)
    const [time, setTime] = useState(0)
    const [resetKey, setResetKey] = useState(Date.now())
    const intervalRef = useRef(null)

    // Load quiz + state
    useEffect(() => {
        if (!storageKey) return
        const storedQuiz = decryptData(sessionStorage.getItem(storageKey + '-quiz'))
        if (storedQuiz) {
            setQuiz(storedQuiz)

            let storedState = decryptData(sessionStorage.getItem(storageKey + '-state'))
            if (!storedState) {
                const initialAnswers = storedQuiz.questions.map(() => ({ selectedId: null }))
                storedState = {
                    answers: initialAnswers,
                    currentIndex: 0,
                    startTime: Date.now()
                }
                sessionStorage.setItem(storageKey + '-state', encryptData(storedState))
            }

            if (!storedState.startTime) {
                storedState.startTime = Date.now()
                sessionStorage.setItem(storageKey + '-state', encryptData(storedState))
            }

            setTime(Math.floor((Date.now() - storedState.startTime) / 1000))
        }
    }, [storageKey])

    // Interval update time
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
            if (stored?.startTime) {
                setTime(Math.floor((Date.now() - stored.startTime) / 1000))
            }
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [resetKey, storageKey])

    // Reset quiz state
    const resetQuizState = (newAnswers, { preserveTime = false } = {}) => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state')) || {}
        const startTime = preserveTime ? (stored.startTime ?? Date.now()) : Date.now()

        const newState = {
            answers: newAnswers,
            currentIndex: 0,
            startTime
        }
        sessionStorage.setItem(storageKey + '-state', encryptData(newState))
        setResetKey(Date.now())

        if (!preserveTime) {
            setTime(0) // reset đồng hồ khi bắt đầu lại
        }
    }

    const handleAnswerSelect = (qIndex, optionId) => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
        stored.answers[qIndex] = { selectedId: optionId }
        sessionStorage.setItem(storageKey + '-state', encryptData(stored))
    }

    const handleRestart = () => {
        const initialAnswers = quiz.questions.map(() => ({ selectedId: null }))
        resetQuizState(initialAnswers, { preserveTime: false }) // reset cả time
    }

    const handleRetryWrong = () => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
        const newAnswers = stored.answers.map((ans, idx) => {
            const q = quiz.questions[idx]
            return ans.selectedId === q.correct_id ? ans : { selectedId: null }
        })
        resetQuizState(newAnswers, { preserveTime: true }) // giữ nguyên time
    }

    if (!quiz) return <div className="p-4 text-center">Không tìm thấy quiz!</div>

    return (
        <div className="p-4">
            <div className="text-lg flex md:flex-row flex-col justify-between font-semibold">
                <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>
                <div className="flex justify-end md:pb-0 pb-4">
                    <p className="font-bold text-lg flex items-center gap-2">
                        Time:
                        <span className="text-blue-600 font-semibold border py-1 rounded min-w-[80px] text-center">
                            {formatTime(time)}
                        </span>
                    </p>
                </div>
            </div>
            <QuizCore
                key={resetKey}
                quiz={quiz}
                storageKey={storageKey}
                onAnswerSelect={handleAnswerSelect}
                mode={'practice'}
            />

            <div className="mt-4 text-center space-x-2">
                <button
                    onClick={handleRestart}
                    className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Bắt đầu lại
                </button>
                <button
                    onClick={handleRetryWrong}
                    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Làm lại các câu sai
                </button>
            </div>
        </div>
    )
}
