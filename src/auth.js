import {AuthenticationError} from 'apollo-server';
import jwt from 'jsonwebtoken';
import config from './config'
import User from './database_models/User';

function validateAccessToken(accessToken) {
  try {
    return jwt.verify(accessToken, config.jwtSecret);
  } catch (error) {
    console.error({validateAccessToken: error.message});
    return null;
  }
}

function validateRefreshToken(refreshToken) {
  try {
    return jwt.verify(refreshToken, 'secret2');
  } catch (error) {
    console.error({validateAccessToken: error.message});
    return null;
  }
}

export const authContext = async ({req, res}) => {

  const accessToken = req.headers['x-access-token'];
  const refreshToken = req.headers['x-refresh-token'];
  if (!accessToken || !refreshToken) {
    return null;
  }
  const decodedAccessToken = validateAccessToken(accessToken);
  if (decodedAccessToken) {
    const userId = decodedAccessToken.sub;
    if (userId) {
      const user = await User.findById(userId).lean().exec();
      return {user};
    }
  }

  const decodedRefreshToken = validateRefreshToken(refreshToken);
  if (decodedRefreshToken) {
    const userId = decodedRefreshToken.sub;
    if (userId) {
      const user = await User.findById(userId).lean().exec();
      const newAccessToken = jwt.sign({sub: userId}, config.jwtSecret, {expiresIn: '1m'});
      const newRefreshToken = jwt.sign({sub: userId}, config.jwtSecret, {expiresIn: '7d'});
      res.set({
        "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
        "x-access-token": newAccessToken,
        "x-refresh-token": newRefreshToken
      });
      console.debug({'auth.js: 52': "refresh tokens set"});
      return {user};
    }
  }

  return null;
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
