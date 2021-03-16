import {gql} from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    user(email: String!): User
  }
  type User {
    displayName: String!
    email: String!
    lists: [List!]
  }
`;

export const resolvers = {}
