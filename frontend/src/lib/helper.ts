import moment from "moment";

const formatDate = (date: string, format: string = "YYYY-MM-DD HH:mm:ss") => {
  if (!date) {
    return "-";
  }

  return moment(date).format(format);
};

export { formatDate };