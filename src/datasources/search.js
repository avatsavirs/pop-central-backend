import {RESTDataSource} from 'apollo-datasource-rest';
import config from '../config/index'

class SearchAPI extends RESTDataSource {

  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/search"
  }

  async myGet(endpoint) {
    try {
      const data = await this.get(String(endpoint));
      return data;
    } catch (error) {
      if (!error.extensions) {
        throw error;
      }
      if (error.extensions.response.status === 404) {
        error.extensions.code = "RESOURCE_NOT_FOUND";
      }
      throw error;
    }
  }

  async searchAll(query) {
    return this.myGet(`/multi?query=${encodeURIComponent(query)}`).then(response => response.results);
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }

}

export default SearchAPI;
