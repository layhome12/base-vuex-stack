import { defineStore } from "pinia";

interface Profile {
  name: string;
  username: string;
  email: string;
  picture: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    profile: {
      name: "",
      username: "",
      email: "",
      picture: "",
    },
  }),
  actions: {
    async setToken(token: string) {
      this.token = token;
    },
    async setProfile(profile: Profile) {
      this.profile = profile;

      console.log(this.profile);
    },
    logout() {
      this.token = "";
      this.profile = {
        name: "",
        username: "",
        email: "",
        picture: "",
      };
    },
  },
  persist: true,
});
