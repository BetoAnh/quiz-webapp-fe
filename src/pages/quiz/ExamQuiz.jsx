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

export default function ExamQuiz() {
    const location = useLocation()
    const { storageKey } = location.state || {}
    const [mode, setMode] = useState('exam')
    const [quiz, setQuiz] = useState(null)
    const [time, setTime] = useState(0)
    const [resetKey, setResetKey] = useState(Date.now())
    const [score, setScore] = useState(null) // ✅ lưu điểm sau khi nộp
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

    const handleAnswerSelect = (qIndex, optionId) => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
        stored.answers[qIndex] = { selectedId: optionId }
        sessionStorage.setItem(storageKey + '-state', encryptData(stored))
    }

    // ✅ Nộp bài và tính điểm
    // ✅ Nộp bài và tính điểm
    const handleSubmit = () => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
        if (!stored || !quiz) return

        // Chặn nếu chưa làm hết
        const unfinished = stored.answers.some(a => a.selectedId === null)
        if (unfinished) {
            alert("Bạn chưa làm hết tất cả câu hỏi!")
            return
        }

        let correct = 0
        quiz.questions.forEach((q, idx) => {
            if (stored.answers[idx]?.selectedId === q.correct_id) {
                correct++
            }
        })

        const total = quiz.questions.length
        const percent = Math.round((correct / total) * 100)

        // 🕒 Tính thời gian đã làm
        const elapsedTime = time

        // ⏹️ Ngừng interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        setScore({ correct, total, percent, elapsedTime })
    }

    // ✅ Xem lại bài
    const handleReview = () => {
        setMode('practice')
    }

    const handleRetake = () => {
        const storedQuiz = decryptData(sessionStorage.getItem(storageKey + '-quiz'))
        if (storedQuiz) {
            const resetAnswers = storedQuiz.questions.map(() => ({ selectedId: null }))
            const newState = {
                answers: resetAnswers,
                currentIndex: 0,
                startTime: Date.now()
            }
            sessionStorage.setItem(storageKey + '-state', encryptData(newState))
        }
        setScore(null)
        setMode('exam')
        setResetKey(Date.now()) // force reset QuizCore
        setTime(0)
    }

    if (!quiz) return <div className="p-4 text-center">Không tìm thấy quiz!</div>

    // Tính đã trả lời hết chưa
    const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
    const allAnswered = stored?.answers?.every(a => a.selectedId !== null)

    return (
        <div className="p-4">
            <div className="text-lg flex md:flex-row flex-col justify-between font-semibold">
                <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>
                <div className="flex justify-end md:pb-0 pb-4">
                    <p className="font-bold text-lg flex items-center gap-2">
                        Time:
                        <span className="text-blue-600 font-semibold border py-1 rounded min-w-[80px] text-center font-mono">
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
                mode={mode}
            />

            <div className="mt-4 text-center space-x-2">
                {!score ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className={`
                            px-6 py-2 rounded text-white 
                            ${allAnswered
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-gray-400 cursor-not-allowed'}
                        `}
                    >
                        Nộp Bài
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleRetake}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Thi lại
                        </button>
                        <button
                            onClick={handleReview}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Xem lại bài
                        </button>
                    </>
                )}
            </div>

            {score && (
                <div className="mt-4 p-4 border rounded bg-white shadow text-center">
                    <p className="text-lg font-bold">
                        Kết quả: {score.correct}/{score.total} ({score.percent}%)
                    </p>
                    <p className="mt-2 text-gray-700">
                        Thời gian làm bài:
                        <span className="font-semibold ml-1">{formatTime(score.elapsedTime)}</span>
                    </p>
                </div>
            )}
        </div>
    )
}
