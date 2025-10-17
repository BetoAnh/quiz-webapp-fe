import api from "./api";

export const categoryService = {
  getAll: () => api.get("/categories"),
  
  getDetail: (id) => api.get(`/categories/${id}`),
};
