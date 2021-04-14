import {gql} from 'apollo-server';
import User from '../database_models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import {isAuthenticated} from '../auth';

export const typeDefs = gql`
  extend type Query {
    me: User!
  }
  extend type Mutation {
    signIn(user: SigninInput!): SigninResponse!
  }
  type SigninResponse implements MutationResponse{
    code: String!
    success: Boolean!
    message: String!
    user: User!
    accessToken: String!
  }
  input SigninInput {
    email: String!
    name: String!
    providerId: String!
    provider:String!
    image:String!
  }
  type User {
    id: String!
    provider: String!
    providerId: String!
    name: String!
    email: String!
    image: String!
    lists: [List!]
  }
`;

export const resolvers = {
  Query: {
    me: isAuthenticated((_, __, {user}) => {
      console.debug({user})
      return user;
    })
  },
  Mutation: {
    signIn: async (_, {user}) => {
      let dbUser = await User.findOne({providerId: user.providerId});
      if (!dbUser) {
        dbUser = await User.create(user);
      }
      const accessToken = jwt.sign({
        sub: dbUser.id
      }, config.jwtSecret, {
        expiresIn: '1h'
      })
      return {
        code: '201',
        message: 'signIn successful',
        success: true,
        user: dbUser,
        accessToken
      }
    }
  },
  User: {
    id: (user) => {
      return user._id
    },
    lists: (user) => {
      return user.lists;
    }
  }
}
