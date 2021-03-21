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

  async getCredits(movieId) {
    try {
      const {cast, crew} = await this.get(`movie/${movieId}/credits`)
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
    if (movie.genres) return movie.genres;
    try {
      const {genres} = await this.getMovieById(movie.id);
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
