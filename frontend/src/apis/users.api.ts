import baseApi, { getBearer, refreshAuthToken } from "./base.api";
import createAuthRefreshInterceptor from "axios-auth-refresh";

// Auto Refresh Token
createAuthRefreshInterceptor(baseApi, refreshAuthToken);

const getUsers = async (params: any) => {
  try {
    const res = await baseApi.get("/users", {
      params,
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

const saveUser = async (payload: any) => {
  try {
    let res = null;

    if (payload.id) {
      res = await baseApi.put(`/users/${payload.id}`, payload, {
        headers: {
          Authorization: "Bearer " + getBearer(),
        },
      });
    } else {
      res = await baseApi.post("/users", payload, {
        headers: {
          Authorization: "Bearer " + getBearer(),
        },
      });
    }

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

const removeUser = async (id?: number) => {
  try {
    const res = await baseApi.delete(`/users/${id}`, {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export { getUsers, saveUser, removeUser };
