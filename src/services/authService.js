import api from "./api";

export const authService = {
  register: (data) => api.post("/register", data),

  login: (data) => api.post("/login", data),

  logout: () => api.post("/logout"),

  auth: () => api.get("/auth"),

  // Đổi mật khẩu
  changePassword: (data) => api.post("/change-password", data),

  // Xóa tài khoản
  deleteAccount: () => api.delete("/delete-account"),
};
