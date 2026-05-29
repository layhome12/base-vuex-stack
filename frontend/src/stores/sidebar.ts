import { defineStore } from "pinia";

export interface SidebarMenuItem {
  title: string;
  url: string;
  icon: string;
}

export interface SidebarMenu {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  items: SidebarMenuItem[];
}

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    menus: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: "house-heart",
        isActive: true,
        items: [],
      },
      {
        title: "System",
        url: "#",
        icon: "square-terminal",
        isActive: true,
        items: [
          {
            title: "Users",
            url: "/admin/system/users",
            icon: "user-round-cog",
          },
          {
            title: "Sidebars",
            url: "/admin/system/sidebars",
            icon: "columns-3-cog",
          },
        ],
      },
    ] as SidebarMenu[],
  }),
});
