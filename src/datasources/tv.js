import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class TvAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/tv";
  }
  async getTvById(tvId) {
    try {
      return this.get(`${tvId}`);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getCreatedBy(tv) {
    try {
      const {created_by: createdBy} = await this.getTvById(tv.id);
      return createdBy;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getGenres(tv) {
    try {
      const {genres} = await this.getTvById(tv.id);
      return genres.map(genre => genre.name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getWebsite(tv) {
    try {
      const {homepage: website} = await this.getTvById(tv.id);
      return website;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getIsInProduction(tv) {
    try {
      return (await this.getTvById(tv.id)).in_production;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getLanguages(tv) {
    try {
      const {spoken_languages: languages} = await this.getTvById(tv.id);
      return languages.map(lang => lang.english_name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getNetworks(tv) {
    try {
      const {networks} = await this.getTvById(tv.id);
      return networks.map(network => network.name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProductionCompanies(tv) {
    try {
      const {production_companies: productionCompanies} = await this.getTvById(tv.id);
      return productionCompanies.map(pc => pc.name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTagline(tv) {
    try {
      const {tagline} = await this.getTvById(tv.id);
      return tagline;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSeasons(tv) {
    try {
      const {seasons} = await this.getTvById(tv.id)
      return seasons;
    } catch (error) {
      console.log(error);
    }
  }

  async getEpisodes(tvId, seasonNumber) {
    try {
      const {episodes} = await this.get(`${tvId}/season/${seasonNumber}`);
      return episodes;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRelated(tv) {
    try {
      const relatedTv = await this.get(`${tv.id}/recommendations`);
      return relatedTv.results;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPopular() {
    try {
      const popularTv = await this.get(`popular`);
      return popularTv.results;
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

export default TvAPI;
