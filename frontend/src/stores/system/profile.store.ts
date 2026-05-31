import { defineStore } from "pinia";

interface ProfileStore {
  loading: boolean;
  form: {
    name: string;
    email: string;
    picture: string;
    password: string;
    biodata: string;
  };
}

export const useProfileStore = defineStore("profile", {
  state: (): ProfileStore => ({
    loading: false,
    form: {
      name: "",
      email: "",
      picture: "",
      password: "",
      biodata: "",
    },
  }),
});
