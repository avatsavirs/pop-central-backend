import {gql, makeExecutableSchema} from 'apollo-server'
import {typeDefs as Movie, resolvers as MovieResolvers} from './Movies';
import {typeDefs as List, resolvers as ListResolvers} from './List';

import {merge} from 'lodash'

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
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
  typeDefs: [Query, Movie, List],
  resolvers: merge(resolvers, MovieResolvers, ListResolvers)
});

export default schema;
