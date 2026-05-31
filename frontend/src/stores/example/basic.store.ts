import { defineStore } from "pinia";

interface NameStore {
  loading: boolean;
  items: any[];
}

export const useNameStore = defineStore("storeName", {
  state: (): NameStore => ({
    loading: false,
    items: [],
  }),
});
