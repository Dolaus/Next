import axiosInstance from "./axiosInstance";
import axios from "axios";

export const deleteExhibition = async (id: number) => {
    await axiosInstance.delete(`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits/${id}`)
}

export const uploadExhibition = async (file: File, description: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);

    await axiosInstance.post('http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getAllExhibits = async (page: number) => {
    return await axios.get(
        `http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits`,
        {
            params: {page},
        }
    );
}

export const getMyExhibits = async (page: number, token: string) => {
    return await axios.get(
        `http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits/my-posts`,
        {
            params: { page },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
