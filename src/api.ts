import ky from "ky";

const api = ky.extend({
  timeout: false,
  prefixUrl:
    // typeof window === "undefined" ? 
    // process.env.API_URL 
    "http://100.67.47.42:5005"
    // : window.ENV.API_URL,
});

export const annotationAPI = ky.extend({
  timeout: false,
  prefixUrl:
    // typeof window === "undefined"
      // ? 
      // process.env.ANNOTATION_URL
      "http://100.67.47.42:5500"
      // : window.ENV.ANNOTATION_URL,
});

export const authAPI = ky.extend({
  timeout: false,
  prefixUrl:
    // typeof window === "undefined" ? 
    // process.env.AUTH_URL 
    "http://100.67.47.42:5002"
    // : window.ENV.AUTH_URL,
});

export default api;
