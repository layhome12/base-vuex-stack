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
        title: "Playground",
        url: "#",
        icon: "square-terminal",
        isActive: true,
        items: [
          {
            title: "Datatable",
            url: "/admin/datatable",
            icon: "align-vertical-distribute-center",
          },
        ],
      },
    ] as SidebarMenu[],
  }),
});
