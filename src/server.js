import {ApolloServer} from 'apollo-server'
import schema from './models'
import TvAPI from './datasources/tv';
import MovieAPI from './datasources/movies';
import PersonAPI from './datasources/person';
import SearchAPI from './datasources/search';
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
