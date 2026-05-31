import { defineStore } from "pinia";

interface GroupStore {
  loading: boolean;
  items: any[];
  display: "IDX" | "FRM";
}

export const useGroupStore = defineStore("groups", {
  state: (): GroupStore => ({
    loading: false,
    items: [],
    display: "IDX",
  }),
});
