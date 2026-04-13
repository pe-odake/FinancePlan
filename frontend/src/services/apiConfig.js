const debug = import.meta.env.VITE_DEBUG === "true";

const API_URL = debug
  ? import.meta.env.VITE_URL_LOCAL
  : import.meta.env.VITE_URL_DEPLOY;

export default API_URL;