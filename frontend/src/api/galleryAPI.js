import apiClient from "./apiClient";

export const getGallery = async () => {
  const response = await apiClient.get("/api/gallery");
  return response.data;
};

export const getGalleryByID = async (id) => {
  const response = await apiClient.get(`/api/gallery/${id}`);
  return response.data;
};

export const createGallery = async (data) => {
  const response = await apiClient.post("/api/gallery/create", data);
  return response.data;
};

export const updateGallery = async (id, data) => {
  const response = await apiClient.put(`/api/gallery/update/${id}`, data);
  return response.data;
};

export const deleteGallery = async (id) => {
  const response = await apiClient.delete(`/api/gallery/delete/${id}`);
  return response.data;
};