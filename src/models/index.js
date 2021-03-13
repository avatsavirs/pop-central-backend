import {gql, makeExecutableSchema} from 'apollo-server'
import {typeDefs as Movie, resolvers as MovieResolvers} from './Movies';
import {merge} from 'lodash'

const Query = gql`
  type Query {
    _empty: String
  }
`;


const resolvers = {
  Query: {
    _empty: () => {
      return "foo"
    },
  }
}

const schema = makeExecutableSchema({
  typeDefs: [Query, Movie],
  resolvers: merge(resolvers, MovieResolvers)
});

export default schema;
