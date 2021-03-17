import {AuthenticationError} from 'apollo-server';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import config from './config'


const client = jwksClient({
  jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: config.auth0ClientId,
  issuer: `https://${config.auth0Domain}/`,
  algorithms: ['RS256']
};

async function getUserFromToken(token) {
  if (!token) {
    return null
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      } else if (decoded.exp > Date.now()) {
        return reject(new Error("token expired"));
      }
      resolve(decoded);
    });
  });
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
