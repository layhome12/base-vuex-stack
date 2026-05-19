import baseApi, { getBearer, refreshAuthToken } from "./base.api";
import createAuthRefreshInterceptor from "axios-auth-refresh";

// Auto Refresh Token
createAuthRefreshInterceptor(baseApi, refreshAuthToken);

const getUsers = async () => {
  try {
    return await baseApi.get("/users?limit=100", {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });
  } catch (error: any) {
    return error.response.data;
  }
};

export { getUsers };
