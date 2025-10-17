import api from "./api";

export const quizService = {
  // Lấy tất cả quiz
  getAll: (params = {}) => api.get("/quizzes", { params }),
  // Lấy quiz theo ID
  getById: (id) => api.get(`/quizzes/${id}`),

  getByUser: (id) => api.get(`/quizzes/user/${id}`),

  // Tạo quiz mới (kèm câu hỏi)
  create: (data) => api.post("/quizzes", data),

  // Cập nhật quiz
  update: (id, data) => api.put(`/quizzes/${id}`, data),

  // Xóa quiz
  delete: (id) => api.delete(`/quizzes/${id}`),

  myquizzes: () => api.get("/myquizzes"),

  generateQuiz: async (file, numQuestions) => {
    const formData = new FormData();
    formData.append("file", file);
    if (numQuestions) formData.append("numQuestions", numQuestions); // chỉ append nếu có

    try {
      const res = await api.post("/generate-quiz", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000, // ✅ thêm timeout 120 giây để tránh bị treo (Guzzle hay timeout 60s)
      });
      return res;
    } catch (error) {
      console.error("❌ API /generate-quiz error:", error);
      throw error;
    }
  },

  getLatest: (limit = 10) => api.get("/home/latest", { params: { limit } }),
  getFeatured: (limit = 10) => api.get("/home/featured", { params: { limit } }),
};
