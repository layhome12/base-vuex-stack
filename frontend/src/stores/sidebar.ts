import { getSidebars } from "@/apis/sidebars.api";
import { Response } from "@/lib/response";
import { defineStore } from "pinia";
import { toast } from "vue-sonner";

export interface SidebarMenuItem {
  key: string;
  parent_key: string;
  seq: number;
  title: string;
  url: string;
  icon: string;
}

export interface SidebarMenu {
  key: string;
  seq: number;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  items: SidebarMenuItem[];
}

export interface BreadcrumbSetter {
  title: string;
  url?: string;
}

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    loading: false,
    menus: [] as SidebarMenu[],
    breadcrumbs: [] as BreadcrumbSetter[],
    form: {
      key: "",
      parent_key: null,
      seq: 0,
      name: "",
      icon: "",
      route: "",
    },
  }),
  actions: {
    async fetchData() {
      try {
        this.loading = true;
        const res = await getSidebars();

        if (!Response.isOk(res)) {
          toast.error(res.message);
          return;
        }

        this.menus = res.data.map(
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
      } finally {
        this.loading = false;
      }
    },
    parentOfChild() {
      return this.menus.map((menu) => ({
        key: menu.key,
        name: menu.title,
      }));
    },
    resetForm() {
      this.form = {
        key: "",
        parent_key: null,
        seq: 0,
        name: "",
        icon: "",
        route: "",
      };
    },
    setBreadcrumbs(list: BreadcrumbSetter[]) {
      this.breadcrumbs = list;
    },
  },
});
