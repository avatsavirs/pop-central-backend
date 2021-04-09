import RESTDataSource from './restDataSource'

class PersonAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseUrl = "http://api.themoviedb.org/3/person";
  }

  async getPersonById(personId) {
    return this.get(personId);
  }

  async getPersonCredits(person) {
    return this.get(`${person.id}/combined_credits`)
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
    return this.get('popular').then(response => response.results);
  }

  async getBornIn(person) {
    if (person.place_of_birth) return person.place_of_birth;
    return this.getPersonById(person.id).then(person => person.place_of_birth);
  }

  async getBio(person) {
    if (person.biography) return person.biography;
    return this.getPersonById(person.id).then(person => person.biography);
  }

}

export default PersonAPI;
