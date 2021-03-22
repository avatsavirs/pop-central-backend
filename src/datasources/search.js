import {RESTDataSource} from 'apollo-datasource-rest';
import config from '../config/index'

class SearchAPI extends RESTDataSource {

  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/search"
  }

  async searchByName(searchKeyword) {
    try {
      const searchResult = await this.get(`/multi?query=${encodeURIComponent(searchKeyword)}`);
      return searchResult.results;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }

}

export default SearchAPI;
