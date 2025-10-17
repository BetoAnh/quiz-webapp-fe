import api from "./api";

export const levelService = {
  getAll: () => api.get("/levels"),
};
