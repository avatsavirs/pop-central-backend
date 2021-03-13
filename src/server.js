import {ApolloServer} from 'apollo-server'
import schema from './models'
import MovieAPI from './datasources/movies';

const server = new ApolloServer({
  schema,
  dataSources: () => {
    return {
      movieAPI: new MovieAPI()
    }
  }
});

export default server;
