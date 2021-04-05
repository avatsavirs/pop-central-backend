
import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class ArtistAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/person";
  }

  async getArtistById(artistId) {
    try {
      return this.get(`${artistId}`)
    } catch (error) {
      return null;
    }
  }

  async getArtistCredits(artist) {
    try {
      const result = await this.get(`${artist.id}/combined_credits`)
      return artist.known_for_department === "Acting" ? [...result.cast, ...result.crew] : [...result.crew, ...result.cast]
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getBirthday(artist) {
    try {
      const birthday = artist.birthday ?? (await this.getArtistById(artist.id)).birthday;
      return birthday;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getPopular() {
    try {
      const popularArtists = await this.get(`popular`);
      return popularArtists.results;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getDeathDay(artist) {
    try {
      const deathday = artist.deathday ?? (await this.getArtistById(artist.id)).deathday;
      return deathday;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBornIn(artist) {
    try {
      const bornIn = artist.place_of_birth ?? (await this.getArtistById(artist.id)).place_of_birth;
      return bornIn;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBio(artist) {
    try {
      const biography = artist.biography ?? (await this.getArtistById(artist.id)).biography;
      return biography;
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

export default ArtistAPI;
