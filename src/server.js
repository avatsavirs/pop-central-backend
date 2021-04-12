import {ApolloServer} from 'apollo-server'
import schema from './models'
import TvAPI from './rest_datasources/tv';
import MovieAPI from './rest_datasources/movies';
import PersonAPI from './rest_datasources/person';
import SearchAPI from './rest_datasources/search';
import {authContext} from './auth';

const server = new ApolloServer({
  schema,
  dataSources: () => {
    return {
      movieAPI: new MovieAPI(),
      tvAPI: new TvAPI(),
      personAPI: new PersonAPI(),
      searchAPI: new SearchAPI()
    }
  },
  context: authContext
});

export default server;
