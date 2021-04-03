import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class MovieAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/movie"
  }

  async getMovieById(movieId) {
    try {
      return this.get(`${movieId}`);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getCredits(movieId) {
    try {
      const {cast, crew} = await this.get(`${movieId}/credits`)
      return [...cast, ...crew];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getDirectors(movie) {
    try {
      const credits = await this.getCredits(movie.id);
      return credits.filter(crewMember => crewMember.job === "Director");
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTagline(movie) {
    try {
      movie = await this.getMovieById(movie.id);
      return movie.tagline;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getGenres(movie) {
    if (movie.genres) return movie.genres.map(genre => genre.name);
    try {
      const {genres} = await this.getMovieById(movie.id);
      console.log(genres);
      return genres.map(genre => genre.name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getReleaseStatus(movie) {
    if (movie.release_status) return movie.release_status;
    try {
      const {status} = await this.getMovieById(movie.id);
      return status;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getLanguages(movie) {
    try {
      const languages = movie.spoken_languages ?? (await this.getMovieById(movie.id)).spoken_languages;
      return languages.map(lang => lang.english_name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBudget(movie) {
    try {
      const budget = movie.budget ?? (await this.getMovieById(movie.id)).budget;
      return budget;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRevenue(movie) {
    try {
      const revenue = movie.revenue ?? (await this.getMovieById(movie.id)).revenue;
      return revenue;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRunTime(movie) {
    try {
      const runtime = movie.runtime ?? (await this.getMovieById(movie.id)).runtime;
      return runtime;
    } catch (error) {
      console.log(runtime);
      return null;
    }
  }

  async getWebsite(movie) {
    try {
      const website = movie.homepage ?? (await this.getMovieById(movie.id)).homepage;
      return website;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProductionCompanies(movie) {
    try {
      const productionCompanies = movie.production_companies ?? (await this.getMovieById(movie.id)).production_companies;
      return productionCompanies.map(pc => pc.name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRelatedMovies(movie) {
    try {
      const relatedMovies = await this.get(`${movie.id}/recommendations`);
      return relatedMovies.results;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPopular() {
    try {
      const popularMovie = await this.get(`popular`);
      return popularMovie.results;
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

export default MovieAPI;
