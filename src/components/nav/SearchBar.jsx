import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchService } from "@/services/searchService";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";



export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ quizzes: [], users: [], categories: [] });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults({ quizzes: [], users: [], categories: [] });
            setOpen(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await searchService.search(query, true); // gọi suggest=1
                setResults(res.data);
                setOpen(true);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    const hasResults =
        results.quizzes?.length > 0 ||
        results.users?.length > 0 ||
        results.categories?.length > 0;

    // Điều hướng khi chọn item
    const handleSelect = (type, item) => {
        setOpen(false);
        if (type === "quiz") navigate(`/quiz/${item.id}`);
        if (type === "user") navigate(`/profile/${item.id}`);
        if (type === "category") navigate(`/category/${item.id}`);
    };

    return (
        <div className="relative w-full max-w-md" ref={wrapperRef}>
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 absolute left-2 top-[50%] -translate-y-[50%]" />
            <input
                type="text"
                placeholder="Search quiz, user, category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setOpen(true)}
                className="w-full rounded-lg pl-10 border border-gray-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Dropdown gợi ý */}
            {open && query && (
                <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-md text-sm z-50 max-h-80 overflow-y-auto">
                    {loading && <p className="px-3 py-2 text-gray-500">Searching...</p>}

                    {!loading && hasResults && (
                        <>
                            {results.quizzes?.length > 0 && (
                                <div>
                                    <h4 className="px-3 py-2 font-semibold text-gray-700 bg-gray-50">
                                        Quizzes
                                    </h4>
                                    {results.quizzes.map((q) => (
                                        <div
                                            key={q.id}
                                            className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                                            onClick={() => handleSelect("quiz", q)}
                                        >
                                            {q.title}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.users?.length > 0 && (
                                <div>
                                    <h4 className="px-3 py-2 font-semibold text-gray-700 bg-gray-50">
                                        Users
                                    </h4>
                                    {results.users.map((u) => (
                                        <div
                                            key={u.id}
                                            className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                                            onClick={() => handleSelect("user", u)}
                                        >
                                            {u.full_name || `${u.first_name} ${u.last_name}`}{" "}
                                            <span className="text-gray-400">
                                                ({u.username || u.email})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.categories?.length > 0 && (
                                <div>
                                    <h4 className="px-3 py-2 font-semibold text-gray-700 bg-gray-50">
                                        Categories
                                    </h4>
                                    {results.categories.map((c) => (
                                        <div
                                            key={c.id}
                                            className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                                            onClick={() => handleSelect("category", c)}
                                        >
                                            {c.name}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Nút xem tất cả */}
                            <div
                                className="px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 cursor-pointer border-t"
                                onClick={() => {
                                    setOpen(false);
                                    navigate(`/search?query=${encodeURIComponent(query)}`);
                                }}
                            >
                                Xem tất cả kết quả cho "{query}"
                            </div>
                        </>
                    )}

                    {!loading && !hasResults && (
                        <p className="px-3 py-2 text-gray-500">No results found</p>
                    )}
                </div>
            )}
        </div>
    );
}
