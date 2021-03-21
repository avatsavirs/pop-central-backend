import {ApolloServer} from 'apollo-server'
import schema from './models'
import TvAPI from './datasources/tv';
import MovieAPI from './datasources/movies';
import ArtistAPI from './datasources/artist';
import mocks from './datasources/mocks';
import {authContext} from './auth';

const server = new ApolloServer({
  schema,
  dataSources: () => {
    return {
      movieAPI: new MovieAPI(),
      tvAPI: new TvAPI(),
      artistAPI: new ArtistAPI()
    }
  },
  context: authContext
});

export default server;
