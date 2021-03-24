import {gql} from 'apollo-server';
import List from '../database_models/List'

export const typeDefs = gql`
  extend type Query {
    me: User!
  }
  type User {
    id: String!
    name: String
    email: String
    image: String
    lists: [List!]
  }
`;

export const resolvers = {
  Query: {
    me: (_, __, {user}) => {
      return user;
    }
  },
  User: {
    id: (user) => {
      return user._id
    },
    lists: (user) => {
      return List.find({userId: user._id});
    }
  }
}
