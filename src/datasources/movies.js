import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class MovieAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/"
  }

  async searchByName(searchKeyword) {
    try {
      const searchResult = await this.get(`search/multi?query=${encodeURIComponent(searchKeyword)}`);
      return searchResult.results;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMovieById(movieId) {
    try {
      return this.get(`movie/${movieId}`);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getMovieCredits(movieId) {
    try {
      const {cast, crew} = await this.get(`movie/${movieId}/credits`)
      return [...cast, ...crew];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMovieDirectors(movieId) {
    try {
      const credits = await this.getMovieCredits(movieId);
      return credits.filter(crewMember => crewMember.job === "Director");
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMovieTagline(movie) {
    try {
      movie = await this.getMovieById(movie.id);
      return movie.tagline;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getArtistById(artistId) {
    try {
      return this.get(`artist/${artistId}`)
    } catch (error) {
      return null;
    }
  }

  async getArtistCredits(artistId) {
    try {
      const result = await this.get(`artist/${artistId}/combined_credits`)
      return [...result.cast, ...result.crew]
    } catch (error) {
      return null;
    }
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }
}

export default MovieAPI;
