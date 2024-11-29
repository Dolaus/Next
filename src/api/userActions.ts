import axiosInstance from "./axiosInstance";

export const getUserInformation = async (token: string) => {
    return await axiosInstance.get(`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/users/my-profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const register = async (username: string, password: string) => await axiosInstance.post('http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/users/register', {
    'username': username,
    'password': password
})