import api from "./api";

export const userService = {
  // Lấy profile theo id
  getById: (id) => api.get(`/users/${id}`),

  // Lấy profile theo username
  getByUsername: (username) => api.get(`/users/username/${username}`),

  // Cập nhật profile (đã có trong routes.php)
  updateProfile: (data) => api.put("/users/profile", data),

  // Đổi mật khẩu (cần thêm trong backend)
  changePassword: (data) => api.put("/users/change-password", data),

  // Xóa tài khoản (cần thêm trong backend)
  deleteAccount: () => api.delete("/users/profile"),
};
