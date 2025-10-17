// components/quiz/QuizListSkeleton.jsx
export default function QuizListSkeleton() {
    return (
        <div className="w-full space-y-4 animate-pulse">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* Search Skeleton */}
                <div className="relative w-full sm:w-1/3">
                    <div className="h-10 w-full rounded-xl bg-gray-200"></div>
                </div>

                {/* Filters Skeleton */}
                <div className="gap-4 flex items-center justify-between">
                    <div className="h-10 w-32 rounded-xl bg-gray-200"></div>
                    <div className="h-10 w-32 rounded-xl bg-gray-200"></div>
                </div>
            </div>

            {/* Quiz Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border bg-white shadow-sm p-4"
                    >
                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                        <div className="flex justify-between mt-8">
                            <div className="h-3 w-10 bg-gray-200 rounded"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
