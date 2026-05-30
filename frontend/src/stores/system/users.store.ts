import { getGroups } from "@/apis/groups.api";
import { getUsers } from "@/apis/users.api";
import { Response } from "@/lib/response";
import type {
  FetchResponseTable,
  OnChangeTable,
  PaginationTable,
} from "@/types/tanstack-table";
import { defineStore } from "pinia";
import { toast } from "vue-sonner";

interface FormUser {
  id?: number;
  group_id?: number;
  name: string;
  email: string;
  password: string;
  biodata: string;
}

interface UserStore {
  loading: boolean;
  items: any[];
  search: string;
  paginate: PaginationTable;
  params: OnChangeTable;
  form: FormUser;
  groups: any[];
}

export const useUserStore = defineStore("users", {
  state: (): UserStore => ({
    loading: false,
    items: [],
    groups: [],
    search: "",
    paginate: {
      page: 1,
      per_page: 10,
      total: 0,
      last_page: 1,
    },
    params: {
      page: 1,
      limit: 10,
    },
    form: {
      id: 0,
      group_id: 0,
      name: "",
      email: "",
      password: "",
      biodata: "",
    },
  }),
  actions: {
    async fetchData() {
      try {
        this.loading = true;
        const res = await getUsers({
          ...this.params,
          search: this.search,
        });

        if (!Response.isOk(res)) {
          toast.error(res.message);
          return;
        }

        const { items, meta } = res.data as FetchResponseTable;
        this.items = items;

        this.paginate = {
          page: meta.currentPage,
          per_page: meta.itemsPerPage,
          total: meta.totalItems,
          last_page: meta.totalPages,
        };
      } finally {
        this.loading = false;
      }
    },

    async onTableChange(payload: OnChangeTable) {
      this.paginate.page = payload.page;
      this.paginate.per_page = payload.limit;

      this.params = payload;
      await this.fetchData();
    },

    async fetchGroup() {
      const res = await getGroups();
      this.groups = res.data;
    },

    resetForm() {
      this.form = {
        id: 0,
        group_id: 0,
        name: "",
        email: "",
        password: "",
        biodata: "",
      };
    },
  },
});
