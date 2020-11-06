const { stringify } = require('querystring');
const axios = require('axios');
const ApiError = require('../errors/ApiError');

module.exports = (token) => {
  return async (method, params) => {
    const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify({
      v: 5.124,
      access_token: token,
      ...params,
    }));

    if (data.error) {
      throw new ApiError(data.error);
    }

    return data.response;
  };
};