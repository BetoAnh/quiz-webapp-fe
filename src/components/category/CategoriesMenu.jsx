import { useState, useEffect } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { categoryService } from "@/services/categoryService";

export default function CategoriesMenu() {
    const [categories, setCategories] = useState([]);
    const [activeParent, setActiveParent] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        categoryService.getAll().then((res) => {
            if (res.data.success) {
                const raw = res.data.data;

                const parents = raw.filter((c) => c.parent_id === null);
                const others = parents.filter(
                    (c) => !c.children || c.children.length === 0
                );
                const cleanedParents = parents.filter(
                    (c) => c.children && c.children.length > 0
                );
                if (others.length > 0) {
                    cleanedParents.push({
                        id: "others",
                        name: "Khác",
                        slug: "khac",
                        children: others,
                    });
                }

                setCategories(cleanedParents);
                if (cleanedParents.length > 0) {
                    setActiveParent(cleanedParents[0]); // 👈 mặc định chọn mục đầu tiên
                }
            }
        });
    }, []);

    return (
        <>
            {/* Nút desktop */}
            <div className="hidden lg:block">
                <Popover className="relative">
                    <Popover.Button className="inline-flex items-center gap-1 px-4 py-2 font-medium text-gray-700 hover:text-gray-900">
                        Chủ đề
                        <ChevronDownIcon className="h-4 w-4" />
                    </Popover.Button>

                    <Popover.Panel className="absolute left-0 mt-2 w-[450px] flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50">
                        {/* Cột trái: parent */}
                        <div className="border-r w-3/5 border-gray-200">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onMouseEnter={() => setActiveParent(cat)}
                                    className={`px-4 py-2 cursor-pointer flex items-center font-medium justify-between ${activeParent?.id === cat.id
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {cat.name}
                                    {cat.children?.length > 0 && (
                                        <ChevronDownIcon className="h-5 w-5 ml-2 rotate-[-90deg]" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Cột phải: children */}
                        <div className="w-2/5">
                            {activeParent && activeParent.children?.length > 0 ? (
                                <div className="flex flex-col max-h-64 overflow-y-auto space-y-1">
                                    {activeParent.children.map((child) => (
                                        <a
                                            key={child.id}
                                            href={`/category/${child.id}-${child.slug}`}
                                            className="block px-2 py-1 font-medium text-gray-700 hover:bg-gray-100 rounded"
                                        >
                                            {child.name}
                                        </a>
                                    ))}
                                    {activeParent.id !== "others" && (
                                        <a
                                            href={`/category/${activeParent.id}-${activeParent.slug}`}
                                            className="block px-2 py-1 font-medium text-gray-700 hover:bg-gray-100 rounded"
                                        >
                                            Khác
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Không có mục con</p>
                            )}
                        </div>
                    </Popover.Panel>
                </Popover>
            </div>

            {/* Nút mobile */}
            <div className="lg:hidden">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                    Chủ đề
                </button>
            </div>

            {/* Drawer Mobile */}
            <Transition show={mobileOpen}>
                <Dialog onClose={() => setMobileOpen(false)} className="relative z-50">
                    <Transition.Child
                        enter="transition-opacity ease-linear duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <Transition.Child
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="fixed right-0 top-0 h-full w-4/5 bg-white shadow-lg p-4 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium">Chủ đề</h2>
                                <button onClick={() => setMobileOpen(false)}>
                                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Hiển thị categories dạng accordion */}
                            {categories.map((cat) => (
                                <div key={cat.id} className="mb-3">
                                    <details className="group">
                                        <summary className="flex justify-between items-center cursor-pointer px-2 py-1 text-gray-700 hover:bg-gray-100 rounded">
                                            {cat.name}
                                            {cat.children?.length > 0 && (
                                                <ChevronDownIcon className="h-4 w-4 group-open:rotate-180 transition-transform" />
                                            )}
                                        </summary>
                                        <div className="ml-4 mt-1 flex flex-col space-y-1">
                                            {cat.children?.map((child) => (
                                                <a
                                                    key={child.id}
                                                    href={`/category/${child.id}-${child.slug}`}
                                                    className="block px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    {child.name}
                                                </a>
                                            ))}
                                            {cat.id !== "others" && cat.children?.length > 0 && (
                                                <a
                                                    href={`/category/${cat.id}-${cat.slug}`}
                                                    className="block px-2 py-1 font-medium text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    Khác
                                                </a>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            ))}
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
}
