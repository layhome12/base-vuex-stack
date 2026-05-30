import moment from "moment";
import { getActivePinia } from "pinia";

function formatDate(date: string, format: string = "YYYY-MM-DD HH:mm:ss") {
  if (!date) {
    return "-";
  }

  return moment(date).format(format);
}

function resetStores() {
  const pinia = getActivePinia();
  if (!pinia) return;

  // resetting all stores
  (pinia as any)?._s.forEach((store: any) => {
    store.$reset?.();
  });
}

export { formatDate, resetStores };
