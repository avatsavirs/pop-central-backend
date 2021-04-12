import RESTDataSource from './restDataSource';

class SearchAPI extends RESTDataSource {

  constructor() {
    super();
    this.baseUrl = "http://api.themoviedb.org/3/search"
  }

  async searchAll(query) {
    return this.get('multi', {
      params: {
        query: query
      }
    })
      .then(response => response.results);
  }

  async searchMovies(query) {
    return this.get('movie', {
      params: {query}
    })
      .then(response => response.results);
  }

  async searchTv(query) {
    return this.get('tv', {
      params: {query}
    })
      .then(response => response.results);
  }

  async searchPerson(query) {
    return this.get('person', {
      params: {query}
    })
      .then(response => response.results);
  }
}

export default SearchAPI;
