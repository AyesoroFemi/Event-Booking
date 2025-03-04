import moment from "moment";

export const formatDateTime = (datetime) => {
  return moment(datetime).format("DD-MM-YYYY"); // Example: January 1, 2025 3:30 PM
};
