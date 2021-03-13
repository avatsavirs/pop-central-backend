import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class MovieAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/"
  }

  async searchByName(searchKeyword) {
    const movies = await this.get(`search/multi?query=${encodeURIComponent(searchKeyword)}`);
    return movies.results;
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }
}

export default MovieAPI;
