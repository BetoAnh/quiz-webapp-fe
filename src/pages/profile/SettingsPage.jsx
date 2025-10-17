import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function SettingsPage() {
    const { user, setUser } = useAuth();
    const [openDialog, setOpenDialog] = useState(null); // "first_name", "last_name", "email", "password", "delete"

    const [formData, setFormData] = useState({
        username: user?.username || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleUpdateField = async (field) => {
        try {
            await userService.updateProfile({ [field]: formData[field] });
            setUser({ ...user, [field]: formData[field] });
            setOpenDialog(null);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Mật khẩu mới không khớp!");
            return;
        }
        try {
            await userService.changePassword(passwordData);
            alert("Đổi mật khẩu thành công!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setOpenDialog(null);
        } catch (err) {
            console.error("Change password failed", err);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await userService.deleteAccount();
            alert("Tài khoản đã bị xóa");
            setUser(null);
        } catch (err) {
            console.error("Delete account failed", err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Cài đặt</h1>

            {/* Thông tin cá nhân */}
            <h2 className="text-lg font-semibold mb-3">Thông tin cá nhân</h2>
            <section className="bg-white shadow rounded-xl mb-6">
                {["username", "first_name", "last_name", "email"].map((field) => (
                    <div
                        key={field}
                        className="flex items-center justify-between border-b border-gray-200 p-6"
                    >
                        <div>
                            <p className="capitalize font-semibold">
                                {field.replace("_", " ")}
                            </p>
                            <p className="font-medium text-sm text-gray-600">{formData[field]}</p>
                        </div>
                        <button
                            className="text-indigo-600 py-2 px-4 hover:bg-blue-100 rounded-3xl font-semibold cursor-pointer"
                            onClick={() => setOpenDialog(field)}
                        >
                            Sửa
                        </button>
                    </div>
                ))}
            </section>

            {/* Tài khoản và quyền riêng tư */}
            <h2 className="text-lg font-semibold mb-3">Tài khoản & Quyền riêng tư</h2>
            <section className="bg-white shadow rounded-xl mb-6">
                <div className="flex justify-between items-center border-b border-gray-200 p-6">
                    <span className="font-medium">Đổi mật khẩu</span>
                    <button
                        onClick={() => setOpenDialog("password")}
                        className="text-indigo-600 py-2 px-4 hover:bg-blue-100 rounded-3xl font-semibold cursor-pointer"
                    >
                        Thay đổi
                    </button>
                </div>

                <div className="flex justify-between items-center p-6">
                    <span className="font-medium text-red-600">Xóa tài khoản</span>
                    <button
                        onClick={() => setOpenDialog("delete")}
                        className="text-red-600 py-2 px-4 hover:bg-red-100 rounded-3xl font-semibold cursor-pointer"
                    >
                        Xóa
                    </button>
                </div>
            </section>

            {/* Dialog sửa thông tin cá nhân */}
            {["username", "first_name", "last_name", "email"].map((field) => (
                <Dialog
                    key={field}
                    open={openDialog === field}
                    onClose={() => setOpenDialog(null)}
                >
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">
                                Sửa {field.replace("_", " ")}
                            </h3>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded mb-4"
                                value={formData[field]}
                                onChange={(e) =>
                                    setFormData({ ...formData, [field]: e.target.value })
                                }
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setOpenDialog(null)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleUpdateField(field)}
                                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            ))}

            {/* Dialog đổi mật khẩu */}
            <Dialog
                open={openDialog === "password"}
                onClose={() => setOpenDialog(null)}
            >
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleChangePassword();
                            }}
                        >
                            {/* Hidden username field for autocomplete */}
                            <input
                                type="text"
                                name="username"
                                autoComplete="username"
                                value={user?.username || user?.email || ""}
                                readOnly
                                hidden
                            />

                            <div className="space-y-3">
                                <input
                                    type="password"
                                    placeholder="Mật khẩu hiện tại"
                                    autoComplete="current-password"
                                    className="w-full border px-3 py-2 rounded"
                                    value={passwordData.oldPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    autoComplete="new-password"
                                    className="w-full border px-3 py-2 rounded"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu mới"
                                    autoComplete="new-password"
                                    className="w-full border px-3 py-2 rounded"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenDialog(null)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </form>

                    </DialogPanel>
                </div>
            </Dialog>

            {/* Dialog xóa tài khoản */}
            <Dialog
                open={openDialog === "delete"}
                onClose={() => setOpenDialog(null)}
            >
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">
                            Xác nhận xóa tài khoản
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn
                            tác.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setOpenDialog(null)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}
