import { getSidebarAccessed } from "@/apis/auth.api";
import { defineStore } from "pinia";
import {
  useSidebarStore,
  type SidebarMenu,
  type SidebarMenuItem,
} from "./sidebar";

interface Profile {
  name: string;
  username: string;
  email: string;
  picture: string;
  group: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    profile: {
      name: "",
      username: "",
      email: "",
      picture: "",
      group: "",
    },
  }),
  actions: {
    async setToken(token: string) {
      this.token = token;
    },
    async setProfile(profile: Profile) {
      this.profile = profile;
    },
    logout() {
      this.token = "";
      this.profile = {
        name: "",
        username: "",
        email: "",
        picture: "",
        group: "",
      };
    },
    async getSidebarAccess() {
      try {
        const res = await getSidebarAccessed();
        const sidebar = useSidebarStore();

        sidebar.menus = res.data.map(
          (menu: any): SidebarMenu => ({
            key: menu.key,
            seq: menu.seq,
            title: menu.name,
            url: menu.route ?? "#",
            icon: !menu.icon ? "badge-question-mark" : menu.icon,
            isActive: true,
            items: (menu.childs ?? []).map(
              (child: any): SidebarMenuItem => ({
                key: child.key,
                parent_key: menu.key,
                seq: child.seq,
                title: child.name,
                url: child.route ?? "#",
                icon: !child.icon ? "badge-question-mark" : child.icon,
              }),
            ),
          }),
        );
      } catch (error: any) {
        // console.log(error);
      }
    },
  },
  persist: true,
});
