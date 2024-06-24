import { httpClient2 } from '../lib/axios';

export const api_checkuser = async (payload) => {
  return await httpClient2
    .post('checkuser/', payload)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const api_login = async (payload) => {
  return await httpClient2
    .post('login/', payload)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
