import { useAuthStore } from "@/stores/auth";
import baseApi, { getBearer } from "./base.api";

const signIn = async (email: string, password: string, remember: boolean) => {
  try {
    return await baseApi.post("/auth", {
      email,
      password,
      remember,
    });
  } catch (error: any) {
    return error.response.data;
  }
};

const signOut = async () => {
  await baseApi.get("/auth/logout");
};

const getProfile = async () => {
  const res = await baseApi.get("/profile", {
    headers: {
      Authorization: "Bearer " + getBearer(),
    },
  });

  // -- profile setter
  if (res.status == 200) {
    const auth = useAuthStore();
    auth.setProfile({
      name: res.data.data.name,
      email: res.data.data.email,
      username: res.data.data.username,
      picture: res.data.data.picture,
    });
  }
};

export { signIn, signOut, getProfile };
