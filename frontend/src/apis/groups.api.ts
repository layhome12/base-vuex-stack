import baseApi, { getBearer, refreshAuthToken } from "./base.api";
import createAuthRefreshInterceptor from "axios-auth-refresh";

// Auto Refresh Token
createAuthRefreshInterceptor(baseApi, refreshAuthToken);

const getGroups = async () => {
  try {
    const res = await baseApi.get("/groups", {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

const getAccess = async (id: number) => {
  try {
    const res = await baseApi.get(`/groups/${id}`, {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

const saveAccess = async (payload: any[], id: number) => {
  try {
    const res = await baseApi.put(`/groups/${id}`, payload, {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export { getGroups, getAccess, saveAccess };
