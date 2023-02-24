import { AxiosError } from "axios";

export const axiosErrorInterceptor = (error: AxiosError) => {
  if (error.message === "Network Error") {
    return Promise.reject(new Error("Erro de conexão!"));
  }
  if (error.response?.status === 404) {
  }

  return Promise.reject(error);
};
