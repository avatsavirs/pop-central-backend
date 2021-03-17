import {ApolloServer} from 'apollo-server'
import schema from './models'
import MovieAPI from './datasources/movies';
import mocks from './datasources/mocks';
import {authContext} from './auth';

const server = new ApolloServer({
  schema,
  dataSources: () => {
    return {
      movieAPI: new MovieAPI()
    }
  },
  context: authContext
});

export default server;
