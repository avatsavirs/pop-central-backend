import {ApolloError} from 'apollo-server';
import axios from 'axios';
import config from '../config/index'


export default class DataSource {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  get(endpoint, {params = {}} = {}) {
    return axios.get(String(endpoint), {
      baseURL: this.baseUrl,
      params: {
        api_key: config.api_key,
        language: 'en-US',
        ...params
      },
    })
      .then(response => response.data)
      .catch((error) => {
        if (!error.response) {
          throw error
        }
        const {response} = error;
        console.error({response});
        if (error.status === 404) {
          throw new ApolloError(response.data.status_message, "NOT_FOUND");
        } else {
          throw new ApolloError(response.data.status_message);
        }
      });
  }
}
