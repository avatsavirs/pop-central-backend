import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class MovieAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/"
  }

  async searchByName(searchKeyword) {
    const searchResult = await this.get(`search/multi?query=${encodeURIComponent(searchKeyword)}`);
    return searchResult.results;
  }

  async getMovieById(movieId) {
    return this.get(`movie/${movieId}`);
  }

  async getMovieCredits(movieId) {
    const {cast, crew} = await this.get(`movie/${movieId}/credits`)
    return [...cast, ...crew];
  }

  async getMovieDirectors(movieId) {
    const credits = await this.getMovieCredits(movieId);
    return credits.filter(crewMember => crewMember.job === "Director");
  }

  async getPersonById(personId) {
    return this.get(`person/${personId}`)
  }

  async getPersonCredits(personId) {
    const result = await this.get(`person/${personId}/combined_credits`)
    console.log(result);
    return [...result.cast, ...result.crew]
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }
}

export default MovieAPI;
