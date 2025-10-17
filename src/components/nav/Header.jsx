import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "@/services";
import {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Import SearchBar
import SearchBar from "@/components/nav/SearchBar";
import CategoriesMenu from "../category/CategoriesMenu";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <header className="z-10">
            <nav
                className="flex items-center justify-between p-6 bg-white rounded-b-2xl shadow-sm lg:px-8"
                aria-label="Global"
            >
                <div className="flex gap-4">
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    {/* Logo */}
                    <div className="flex lg:flex-1">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">MyApp</span>
                            <img
                                alt=""
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                        </a>
                    </div>
                    <div className="hidden lg:flex items-center space-x-6">
                        <CategoriesMenu />
                    </div>
                </div>


                {/* Thanh tìm kiếm với nav + tạo */}
                <div className="hidden lg:flex flex-1 justify-center px-6 items-center space-x-6">
                    <SearchBar />
                </div>




                {/* User / Login */}
                <div className="flex gap-4 items-center space-x-4">
                    <a
                        href="/dashboard/new"
                        className="block text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        + Tạo 
                    </a>

                    {user ? (
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-gray-700 cursor-pointer">
                                <span className="font-bold">{user.first_name[0]}</span>
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-2 w-60 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none z-10">
                                <MenuItem>
                                    <div className="p-4 flex border-b border-gray-200 gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-gray-700 cursor-pointer">
                                            <span className="font-bold">{user.first_name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{`${user.last_name} ${user.first_name}`}</p>
                                            <p className="text-sm font-medium text-gray-500">{user.username || user.email}</p>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <NavLink
                                            to={`/profile/${user.id}`}
                                            className={`block px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                }`}
                                        >
                                            Profile
                                        </NavLink>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <a
                                            href="/dashboard"
                                            className={`block px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                }`}
                                        >
                                            Dashboard
                                        </a>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <a
                                            href="/settings"
                                            className={`block px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                }`}
                                        >
                                            Cài đặt
                                        </a>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={handleLogout}
                                            className={`w-full text-left block px-4 py-2 text-sm text-red-600 ${active ? "bg-gray-100" : ""
                                                }`}
                                        >
                                            Đăng xuất
                                        </button>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <a
                            href="/login"
                            className="text-sm font-semibold text-white py-2 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700"
                        >
                            Đăng nhập
                        </a>
                    )}
                </div>
            </nav>

            {/* Mobile menu dialog */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50 bg-black/10" />
                <DialogPanel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <a href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">MyApp</span>
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                    className="h-8 w-auto"
                                />
                            </a>
                        </div>

                        <div className="items-center gap-4 space-x-4 flex sm:hidden ">
                            <a
                                href="/create"
                                className="block text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                + Tạo
                            </a>
                            {user ? (
                                <Menu as="div" className="relative">
                                    <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-gray-700 cursor-pointer">
                                        <span className="font-bold">{user.first_name[0]}</span>
                                    </MenuButton>
                                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
                                        <MenuItem>
                                            <div className="p-4 flex border-b border-gray-200 gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-gray-700 cursor-pointer">
                                                    <span className="font-bold">{user.first_name[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{`${user.last_name} ${user.first_name}`}</p>
                                                    <p className="text-sm font-medium text-gray-500">{user.username || user.email}</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <NavLink
                                                    to={`/profile/${user.id}`}
                                                    className={`block font-semibold px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                        }`}
                                                >
                                                    Profile
                                                </NavLink>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <a
                                                    href="/dashboard"
                                                    className={`block px-4 font-semibold py-2 text-sm ${active ? "bg-gray-100" : ""
                                                        }`}
                                                >
                                                    Dashboard
                                                </a>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <a
                                                    href="/settings"
                                                    className={`block px-4 font-semibold py-2 text-sm ${active ? "bg-gray-100" : ""
                                                        }`}
                                                >
                                                    Cài đặt
                                                </a>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`w-full text-left block font-semibold px-4 py-2 text-sm text-red-600 ${active ? "bg-gray-100" : ""
                                                        }`}
                                                >
                                                    Đăng xuất
                                                </button>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            ) : (
                                <a
                                    href="/login"
                                    className="text-sm font-semibold text-white py-2 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700"
                                >
                                    Đăng nhập
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Menu chủ đề trong mobile */}
                    <div className="mt-6">
                        <CategoriesMenu />
                    </div>

                    {/* Search trong mobile */}
                    <div className="mt-6">
                        <SearchBar />
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
