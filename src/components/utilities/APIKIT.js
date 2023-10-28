import axios from "axios";

let APIKit = {
  get: (url) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`http://localhost:8500${url}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJWT()}`,
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  },
  post: (url, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`http://localhost:8500${url}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJWT()}`,
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  },
  put: (url, payload) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`http://localhost:8500${url}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJWT()}`,
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  },
  delete: (url) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`http://localhost:8500${url}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJWT()}`,
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  },
};
export const setClientToken = (token) => {
  // APIKit.interceptors.request.use(function (config) {
  //   config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });
};

export const deleteToken = () => {
  // delete axios.defaults.headers.common['Authorization'];
};
export function getJWT() {
  var jwt = "";
  var data = JSON.parse(sessionStorage.getItem("userData"));
  if (data) {
    try {
      jwt = data.token;
    } catch (err) {}
  }
  return jwt;
}
export default APIKit;
// export default keyEmpty;
