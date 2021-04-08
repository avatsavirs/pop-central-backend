
import {RESTDataSource} from 'apollo-datasource-rest'
import config from '../config/index'

class PersonAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.themoviedb.org/3/person";
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

  async getPersonById(personId) {
    return this.myGet(personId);
  }

  async getPersonCredits(person) {
    return this.myGet(`${person.id}/combined_credits`)
      .then(({cast, crew}) => {
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
        return person.known_for_department === "Acting" ? [...cast, ...uniqueCrewArray] : [...uniqueCrewArray, ...cast]
      })
  }

  async getBirthday(person) {
    if (person.birthday) return person.birthday;
    return this.getPersonById(person.id).then(person => person.birthday);
  }

  async getDeathDay(person) {
    if (person.deathday) return person.deathday;
    return this.getPersonById(person.id)
      .then(person => person.deathday);
  }

  async getPopular() {
    return this.myGet('popular').then(response => response.results);
  }

  async getBornIn(person) {
    if (person.place_of_birth) return person.place_of_birth;
    return this.getPersonById(person.id).then(person => person.place_of_birth);
  }

  async getBio(person) {
    if (person.biography) return person.biography;
    return this.getPersonById(person.id).then(person => person.biography);
  }

  willSendRequest(req) {
    req.params.set('api_key', config.api_key);
    req.params.set('language', 'en-US');
  }

}

export default PersonAPI;
