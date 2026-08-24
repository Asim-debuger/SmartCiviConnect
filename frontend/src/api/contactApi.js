import axiosInstance from "./axiosInstance";

export const submitContact = async (payload) => {
  const response = await axiosInstance.post("/public/contact", payload);
  return response.data;
};
