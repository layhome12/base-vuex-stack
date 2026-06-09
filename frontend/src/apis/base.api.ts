// services/api.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const baseUrl = import.meta.env.VITE_API_URL;
const nodeEnv = import.meta.env.PROD;

const baseApi = axios.create({
  baseURL: baseUrl,
  withCredentials: nodeEnv,
});

const getBearer = () => {
  const auth = useAuthStore();
  return auth.token;
};

const setBearer = (token: string) => {
  const auth = useAuthStore();
  auth.setToken(token);
};

const refreshAuthToken = async (failedReq: any) => {
  return fetch(`${baseUrl}/auth/refresh`, {
    credentials: nodeEnv ? "include" : undefined,
  }).then(async (res) => {
    if (res.status !== 200) {
      const auth = useAuthStore();
      auth.logout();

      window.location.replace("/");
      return Promise.reject();
    }

    const result = await res.json();
    setBearer(result.data.token);

    failedReq.response.config.headers["Authorization"] =
      `Bearer ${result.data.token}`;

    return Promise.resolve(result.data.token);
  });
};

export default baseApi;
export { baseUrl, getBearer, setBearer, refreshAuthToken };
