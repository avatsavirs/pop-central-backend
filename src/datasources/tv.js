import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class TvAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/tv";
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

  async getTvById(tvId) {
    return this.myGet(tvId);
  }

  async getCreatedBy(tv) {
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.created_by);
  }

  async getGenres(tv) {
    if (tv.genres) return tv.genres.map(genre => genre.name);
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.genres.map(genre => genre.name));
  }

  async getWebsite(tv) {
    if (tv.homepage) return tv.homepage;
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.homepage);
  }

  async getIsInProduction(tv) {
    if (tv.in_production) return tv.in_production;
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.in_production);
  }

  async getCredits(tvId) {
    return this.myGet(`${tvId}/credits`)
      .then(({cast, crew}) => [...cast, ...crew]);
  }

  async getLanguages(tv) {
    if (tv.spoken_languages) return tv.spoken_languages.map(lang => lang.name);
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.spoken_languages.map(lang => lang.english_name));
  }

  async getNetworks(tv) {
    if (tv.networks) return tv.networks.map(network => network.name);
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.networks.map(network => network.name));
  }

  async getProductionCompanies(tv) {
    if (tv.production_companies) return tv.production_companies.map(pc => pc.name);
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.production_companies.map(pc => pc.name));
  }

  async getTagline(tv) {
    if (tv.tagline) return tv.tagline;
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.tagline);
  }

  async getSeasons(tv) {
    if (tv.seasons) return tv.seasons;
    return this.getTvById(tv.id)
      .then(tvShow => tvShow.seasons);
  }

  async getEpisodes(tvId, seasonNumber) {
    return this.myGet(`${tvId}/season/${seasonNumber}`)
      .then(result => result.episodes);
  }

  async getRelated(tv) {
    return this.myGet(`${tv.id}/recommendations`)
      .then(response => response.results);
  }

  async getPopular() {
    return this.myGet('popular').then(response => response.results);
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }
}

export default TvAPI;
