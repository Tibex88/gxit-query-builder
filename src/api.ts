import ky from "ky";

const api = ky.extend({
  timeout: false,
  prefixUrl:
    "http://100.67.47.42:5005"
});

export const annotationAPI = ky.extend({
  timeout: false,
  prefixUrl:
      "http://100.67.47.42:5500"
});

export const authAPI = ky.extend({
  timeout: false,
  prefixUrl:
    "http://100.67.47.42:5002"
});

export default api;
