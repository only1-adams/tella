import axios from "axios";

import { API_URL, API_URL2 } from "../config";

function authRequestInterceptor(config) {
  const token = localStorage.getItem("dms_access_token");
  if (token) {
    config.headers.authorization = `token ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
}

export const httpClient = axios.create({
  baseURL: API_URL,
});

export const httpClient2 = axios.create({
  baseURL: API_URL2,
});

httpClient.interceptors.request.use(authRequestInterceptor);
httpClient2.interceptors.request.use(authRequestInterceptor);
