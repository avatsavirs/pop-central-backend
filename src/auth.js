import {AuthenticationError} from 'apollo-server';
import jwt from 'jsonwebtoken';
import config from './config'
import User from './database_models/User';

function validateAccessToken(accessToken) {
  try {
    return jwt.verify(accessToken, config.jwtSecret);
  } catch (error) {
    return null;
  }
}

export const authContext = async ({req, res}) => {

  const accessToken = req.headers['x-access-token'];
  const refreshToken = req.headers['x-refresh-token'];
  if (!accessToken || !refreshToken) return null;

  const decodedAccessToken = validateAccessToken(accessToken);
  if (!decodedAccessToken) return null;

  const userId = decodedAccessToken.sub;
  if (!userId) return null;

  const user = await User.findById(userId).lean().exec();
  return {user};
}

export function isAuthenticated(resolver) {
  return function newResolver(parent, args, context, info) {
    const {user} = context;
    if (!user) {
      throw new AuthenticationError("Unauthorized Request");
    }
    return resolver(parent, args, context, info);
  }
}
