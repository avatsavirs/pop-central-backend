import {gql} from 'apollo-server';
import User from '../database_models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import {isAuthenticated} from '../auth';
import Token from '../database_models/Token';

export const typeDefs = gql`
  extend type Query {
    me: User!
  }
  extend type Mutation {
    signIn(user: SigninInput!): SigninResponse!
    refreshTokens(accessToken: String!, refreshToken: String!): RefreshTokensResponse!
  }
  type RefreshTokensResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    accessToken: String
    refreshToken: String
  }
  type SigninResponse implements MutationResponse{
    code: String!
    success: Boolean!
    message: String!
    user: User!
    accessToken: String!
    refreshToken: String!
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
        expiresIn: config.jwtAccessExpTime
      });
      const refreshToken = jwt.sign({
        sub: dbUser.id,
      }, config.jwtSecretRef, {
        expiresIn: config.jwtRefExpTime
      });
      const expirationTime = jwt.decode(accessToken).exp;
      await Token.create({accessToken, refreshToken, user: dbUser._id, expirationTime});
      return {
        code: '201',
        message: 'signIn successful',
        success: true,
        user: dbUser,
        accessToken,
        refreshToken
      }
    },
    refreshTokens: async (_, {accessToken, refreshToken}) => {
      try {
        const dbToken = await Token.findOne({accessToken});
        if (!dbToken) {
          console.debug({reqAccessToken: accessToken})
          throw new Error('invalid access token');
        }
        if (!dbToken.isExpired) throw new Error('acess token has not expired yet');
        if (dbToken.refreshToken !== refreshToken) throw new Error('invalid refresh token');
        const decodedRefreshToken = jwt.verify(refreshToken, config.jwtSecretRef);
        const userId = decodedRefreshToken.sub;
        if (dbToken.user.toString() !== userId) throw new Error('invalid refresh token');
        const user = await User.findById(userId).lean().exec();
        if (user) {
          const newAccessToken = jwt.sign({sub: userId}, config.jwtSecret, {expiresIn: config.jwtAccessExpTime});
          const newRefreshToken = jwt.sign({sub: userId}, config.jwtSecretRef, {expiresIn: config.jwtRefExpTime});
          dbToken.accessToken = newAccessToken;
          dbToken.refreshToken = newRefreshToken;
          dbToken.expirationTime = jwt.decode(newAccessToken).exp;
          await dbToken.save();
          console.debug({newAccessToken})
          return {
            code: '200',
            success: true,
            message: 'new tokens generated successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        } else {
          console.error('User not found')
          return {
            code: '404',
            success: false,
            message: 'user not found'
          }
        }
      } catch (error) {
        console.error(error.message);
        return {
          code: '500',
          success: false,
          message: error.message
        };
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
