import {ApolloServer} from 'apollo-server'
import schema from './models'
import MovieAPI from './datasources/movies';
import {mocks} from './datasources/mocks';

const server = new ApolloServer({
  schema,
  mocks: mocks,
  dataSources: () => {
    return {
      movieAPI: new MovieAPI()
    }
  }
});

export default server;
