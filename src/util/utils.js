import process from "process";

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default () => development;

export const objectToQueryParams = (obj) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
