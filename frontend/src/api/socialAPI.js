import apiClient from "./apiClient";

export const fetchInstagramPosts = async () => {
    try {
        const response = await apiClient.get("/api/social/posts?source=instagram");
        return response.data.posts;
    } catch (error) {
        throw error;
    }
};

export const fetchLinkedinPosts = async () => {
    try {
        const response = await apiClient.get("/api/social/posts?source=linkedin");
        return response.data.posts;
    } catch (error) {
        throw error;
    }
};
