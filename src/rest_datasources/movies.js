import RESTDataSource from './restDataSource';

class MovieAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseUrl = "http://api.themoviedb.org/3/movie";
  }

  async getMovieById(movieId) {
    return this.get(movieId);
  }

  async getCredits(movieId) {
    const {cast, crew} = await this.get(`${movieId}/credits`)
    return [...cast, ...crew];
  }

  async getDirectors(movie) {
    const credits = await this.getCredits(movie.id);
    return credits.filter(crewMember => crewMember.job === "Director");
  }

  async getTagline(movie) {
    if (movie.tagline) return movie.tagline;
    return this.getMovieById(movie.id).then(movie => movie.tagline);
  }

  async getGenres(movie) {
    if (movie.genres) return movie.genres.map(genre => genre.name);
    return this.getMovieById(movie.id)
      .then(movie => {
        return movie.genres.map(genre => genre.name);
      })
  }

  async getReleaseStatus(movie) {
    if (movie.status) return movie.status;
    return this.getMovieById(movie.id)
      .then(movie => movie.status);
  }

  async getLanguages(movie) {
    if (movie.spoken_languages) return movie.spoken_languages.map(lang => lang.english_name);
    return this.getMovieById(movie.id)
      .then(movie => {
        return movie.spoken_languages.map(lang => lang.english_name);
      })
  }

  async getBudget(movie) {
    if (movie.budget) return movie.budget;
    return this.getMovieById(movie.id)
      .then(movie => movie.budget);
  }

  async getRevenue(movie) {
    if (movie.revenue) return movie.revenue;
    return this.getMovieById(movie.id)
      .then(movie => movie.revenue);
  }

  async getRunTime(movie) {
    if (movie.runtime) return movie.runtime;
    return this.getMovieById(movie.id)
      .then(movie => movie.runtime);
  }

  async getWebsite(movie) {
    if (movie.homepage) return movie.homepage;
    return this.getMovieById(movie.id)
      .then(movie => movie.homepage);
  }

  async getProductionCompanies(movie) {
    if (movie.production_companies) return movie.production_companies.map(pc => pc.name);
    return this.getMovieById(movie.id)
      .then(movie => {
        return movie.production_companies.map(pc => pc.name);
      })
  }

  async getRelatedMovies(movie) {
    return this.get(`${movie.id}/recommendations`)
      .then(response => response.results);
  }

  async getPopular() {
    return this.get("popular")
      .then(response => response.results);
  }
}

export default MovieAPI;
