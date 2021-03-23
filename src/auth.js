import {AuthenticationError} from 'apollo-server';
import jwt from 'jsonwebtoken';
import config from './config'


async function getUserFromToken(token) {
  if (!token) {
    return null
  }
  return jwt.verify(token, config.jwtSecret, {algorithms: ['HS256']});
}

export const authContext = async ({req}) => {
  try {
    const token = req.headers.authorization;
    const user = await getUserFromToken(token);
    return {user};
  } catch (error) {
    console.log(error.message);
    return null
  }
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
