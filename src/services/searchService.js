import api from "./api";

export const searchService = {
  // Tìm kiếm (autocomplete hoặc full search)
  search: (query, suggest = false, page = 1) =>
    api.get("/search", {
      params: {
        query,
        suggest: suggest ? 1 : 0, // suggest=1 để gợi ý nhanh
        page, // dùng cho phân trang full search
      },
    }),
};
