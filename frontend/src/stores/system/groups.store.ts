import { getGroups } from "@/apis/groups.api";
import { Response } from "@/lib/response";
import { defineStore } from "pinia";

export interface GroupAccess {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}
interface GroupStore {
  loading: boolean;
  items: any[];
  display: "IDX" | "FRM";
  form: {
    group_id: number;
    group_name: string;
  };
  access: Record<string, GroupAccess>;
}

export const useGroupStore = defineStore("groups", {
  state: (): GroupStore => ({
    loading: false,
    items: [],
    display: "IDX",
    form: {
      group_id: 0,
      group_name: "",
    },
    access: {},
  }),
  actions: {
    async fetchData() {
      try {
        this.loading = true;
        const res = await getGroups();

        if (!Response.isOk(res)) {
          return;
        }

        this.items = res.data;
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        group_id: 0,
        group_name: "",
      };

      this.access = {};
    },
  },
});
