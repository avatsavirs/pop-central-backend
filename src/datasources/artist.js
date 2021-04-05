
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
      const {cast, crew} = await this.get(`${artist.id}/combined_credits`)
      const uniqueCrew = {};
      crew.forEach(c => {
        if (!uniqueCrew[c.id]) {
          uniqueCrew[c.id] = c;
          uniqueCrew[c.id].jobs = [c.job]
        } else {
          uniqueCrew[c.id].jobs.push(c.job);
        }
      })
      const uniqueCrewArray = Object.values(uniqueCrew);
      const credits = artist.known_for_department === "Acting" ? [...cast, ...uniqueCrewArray] : [...uniqueCrewArray, ...cast]
      return credits;
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
