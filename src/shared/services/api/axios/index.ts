import axios from "axios";
import { Environment } from "../../../environment/Environment";
import {
  axiosErrorInterceptor,
  axiosResponseInterceptor,
} from "./interceptors";

const api = axios.create({
   baseURL: Environment.URL_BASE,

});
api.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

api.interceptors.response.use(
  (response) => axiosResponseInterceptor(response),
  (error) => axiosErrorInterceptor(error)
);

export { api };
