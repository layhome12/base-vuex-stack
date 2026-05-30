import baseApi, { getBearer, refreshAuthToken } from "./base.api";
import createAuthRefreshInterceptor from "axios-auth-refresh";

// Auto Refresh Token
createAuthRefreshInterceptor(baseApi, refreshAuthToken);

const getSidebars = async () => {
  try {
    const res = await baseApi.get("/sidebars", {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

const saveSidebar = async (payload: any) => {
  try {
    const res = await baseApi.post("/sidebars", payload, {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

const removeSidebar = async (key: string) => {
  try {
    const res = await baseApi.delete(`/sidebars/${key}`, {
      headers: {
        Authorization: "Bearer " + getBearer(),
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export { getSidebars, saveSidebar, removeSidebar };
