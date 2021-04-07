
import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class PersonAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/person";
  }

  async getPersonById(personId) {
    try {
      return this.get(`${personId}`)
    } catch (error) {
      return null;
    }
  }

  async getPersonCredits(person) {
    try {
      const {cast, crew} = await this.get(`${person.id}/combined_credits`)
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
      const credits = person.known_for_department === "Acting" ? [...cast, ...uniqueCrewArray] : [...uniqueCrewArray, ...cast]
      return credits;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getBirthday(person) {
    try {
      const birthday = person.birthday ?? (await this.getPersonById(person.id)).birthday;
      return birthday;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getPopular() {
    try {
      const popularPersons = await this.get(`popular`);
      return popularPersons.results;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getDeathDay(person) {
    try {
      const deathday = person.deathday ?? (await this.getPersonById(person.id)).deathday;
      return deathday;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBornIn(person) {
    try {
      const bornIn = person.place_of_birth ?? (await this.getPersonById(person.id)).place_of_birth;
      return bornIn;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBio(person) {
    try {
      const biography = person.biography ?? (await this.getPersonById(person.id)).biography;
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

export default PersonAPI;
