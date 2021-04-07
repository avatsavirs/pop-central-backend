import {gql, makeExecutableSchema} from 'apollo-server'
import {typeDefs as Movie, resolvers as MovieResolvers} from './Movies';
import {typeDefs as List, resolvers as ListResolvers} from './List';
import {typeDefs as User, resolvers as UserResolvers} from './User';
import {typeDefs as Search, resolvers as SearchResolvers} from './Search';
import {typeDefs as TV, resolvers as TVResolvers} from './TV';
import {typeDefs as Person, resolvers as PersonResolvers} from './Person';

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
  },
  MutationResponse: {
    __resolveType: () => {}
  }
}

const schema = makeExecutableSchema({
  typeDefs: [Query, Movie, List, User, Search, TV, Person],
  resolvers: merge(resolvers, MovieResolvers, ListResolvers, UserResolvers, SearchResolvers, TVResolvers, PersonResolvers),
});

export default schema;
