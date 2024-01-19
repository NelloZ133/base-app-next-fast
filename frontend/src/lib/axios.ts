import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import environment from "@/utils/environment";

const axiosInstance = axios.create({
  baseURL: environment.API_URL,
});

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = {
    ...config.headers,
    "X-API-Key": environment.API_KEY,
  };
  return config;
});

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    switch (error?.response?.status) {
      case 401:
        message.error("Unauthorized! Please try to login again", undefined, () => {
          window.location.replace("/login");
        });
        break;
      case 403:
        message.error("No permission to do this action");
        break;
      case 406:
        message.error("Incorrect request flow! Please try again.");
        break;
      case 422:
        message.error("Data not correct! Please try again or contact admin.");
        break;
      case 452:
        message.error("Incorrect password! Please try again.");
        break;
      default:
        message.error(error.message);
        break;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
