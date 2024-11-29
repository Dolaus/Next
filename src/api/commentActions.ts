import axiosInstance from "./axiosInstance";

export const getAllCommentsForPost = async (id: number) => {
    return await axiosInstance.get(`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits/${id}/comments`);
}

export const deleteCommentById = async (id: number) => {
    return await axiosInstance.delete(`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits/{exhibitId}/comments/${id}`)
}

export const createCommentForPostById = async (id: number, text: string) => {
    return await axiosInstance.post(`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits/${id}/comments`, {
        text: text
    });
}
