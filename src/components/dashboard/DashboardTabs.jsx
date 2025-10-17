import { NavLink } from "react-router-dom";
import {
    PlusCircleIcon,
    ClipboardDocumentListIcon,
    BookmarkIcon,
} from "@heroicons/react/24/outline";

const tabs = [
    { to: "/dashboard", label: "Trang chủ", icon: ClipboardDocumentListIcon, end: true },
    { to: "/dashboard/new", label: "Thêm mới", icon: PlusCircleIcon },
    { to: "/dashboard/my", label: "Quiz của tôi", icon: ClipboardDocumentListIcon },
    { to: "/dashboard/saved", label: "Đã lưu", icon: BookmarkIcon },
];

export default function DashboardTabs() {
    return (
        <nav className="flex space-x-2 rounded-xl bg-gray-100">
            {tabs.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={end} // 👈 chỉ Tab "Trang chủ" có end=true
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${isActive
                            ? "bg-white shadow text-indigo-600"
                            : "text-gray-600 hover:bg-white/70"
                        }`
                    }
                >
                    <Icon className="h-5 w-5" />
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}
