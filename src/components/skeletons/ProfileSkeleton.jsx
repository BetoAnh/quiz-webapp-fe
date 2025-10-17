import QuizListSkeleton from "./QuizListSkeleton";

export default function ProfileSkeleton() {
    return (
        <div className="py-6">
            <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                {/* Name + username */}
                <div className="mt-1">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>

                {/* Notes */}
                <div className="mt-5 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>

                <div className="mt-4 mb-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-70"></div>
                </div>
            </div>


            {/* Quizzes skeleton */}
            <div className="mt-8 bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <QuizListSkeleton />
            </div>
        </div>
    );
}
