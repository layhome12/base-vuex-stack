import { getUsers } from "@/apis/users.api";
import type {
  FetchResponseTable,
  OnChangeTable,
  PaginationTable,
} from "@/types/tanstack-table";
import { defineStore } from "pinia";

interface NameStore {
  loading: boolean;
  items: any[];
  search: string;
  paginate: PaginationTable;
  params: OnChangeTable;
}

export const useNameStore = defineStore("storeName", {
  state: (): NameStore => ({
    loading: false,
    items: [],
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
  }),
  actions: {
    async fetchData() {
      try {
        this.loading = true;
        const res = await getUsers({
          ...this.params,
          search: this.search,
        });

        const { items, meta } = res.data.data as FetchResponseTable;
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
  },
});
