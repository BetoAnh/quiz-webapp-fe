import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default function SavedQuizzes() {
    return (
        <div className="w-full max-w-5xl mx-auto py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz đã lưu</h1>
            <DashboardTabs />

            <div className="mt-6">
                {/* List quiz đã lưu */}
            </div>
        </div>
    );
}
