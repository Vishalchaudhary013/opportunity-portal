import apiClient from "./apiClient";

export const fetchInstagramPosts = async () => {
    
        const response = await apiClient.get("/api/social/posts?source=instagram");
        return response.data.posts;
    
};

export const fetchLinkedinPosts = async () => {
    
        const response = await apiClient.get("/api/social/posts?source=linkedin");
        return response.data.posts;
    
};
