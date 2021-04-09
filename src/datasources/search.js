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

}

export default SearchAPI;
