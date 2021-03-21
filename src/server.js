import {ApolloServer} from 'apollo-server'
import schema from './models'
import TvAPI from './datasources/tv';
import MovieAPI from './datasources/movies';
import mocks from './datasources/mocks';
import {authContext} from './auth';

const server = new ApolloServer({
  schema,
  dataSources: () => {
    return {
      movieAPI: new MovieAPI(),
      tvAPI: new TvAPI()
    }
  },
  context: authContext
});

export default server;
