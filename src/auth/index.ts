import { Router, json } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const authRouter: Router = Router();
const parseJSON = json();
authRouter.use(parseJSON);
dotenv.config();
const awsCreds = {
  accessKeyId: process.env.ACCESS_ID,
  SecretAccessKey: process.env.SECRET_ACCESS,
  sessionToken: process.env.SESSION_TOKEN,
  region: process.env.region,
};

AWS.config.update(awsCreds);

authRouter.post('/login', async (req, res) => {
  const key: Secret | undefined = process.env.ACCESS_KEY;
  const { username, newPassword = '' } = req.body;

  // Configure Cognito user pool
  const userPool = new CognitoUserPool({
    UserPoolId: process.env.COGNITO_USERPOOLID as string,
    ClientId: process.env.COGNITO_CLIENTID as string,
  });

  // Create authentication details
  const authenticationData = {
    Username: req.body.username,
    Password: req.body.password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  // Create Cognito user object
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  // Authenticate user

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (session) => {
      const options: jwt.SignOptions = {
        header: { alg: 'HS256' },
      };
      const load = {
        name: session.getIdToken().payload.email,
        email: session.getIdToken().payload.email,
        picture: null,
        sub: session.getIdToken().payload.sub,
        userId: session.getIdToken().payload.sub,
        clientId: session.getIdToken().payload.aud,
      };

      const jwtToken = jwt.sign(load, key as string, options);
      res.status(200).send(jwtToken);
    },
    onFailure: () => {
      // Authentication failed
      res.status(401).json({ error: 'Authentication failed' });
    },
    newPasswordRequired: () => {
      // Set the new password for the user
      cognitoUser.completeNewPasswordChallenge(newPassword, null, {
        onSuccess: (session) => {
          // Password updated successfully, generate a session token
          const options: jwt.SignOptions = {
            header: { alg: 'HS256' },
          };
          const load = {
            name: session.getIdToken().payload.email,
            email: session.getIdToken().payload.email,
            picture: null,
            sub: session.getIdToken().payload.sub,
            userId: session.getIdToken().payload.sub,
            clientId: session.getIdToken().payload.aud,
          };

          const jwtToken = jwt.sign(load, key as string, options);
          res.status(200).send(jwtToken);
        },
        onFailure: () => {
          res.status(500).json({ error: 'Error setting new password' });
        },
      });
    },
  });
});

authRouter.post('/verify', (req, res) => {
  const key: Secret | undefined = process.env.ACCESS_KEY;

  if (!req.body.token) {
    return res
      .status(400)
      .json({ error: 'Token is missing in the request body' });
  }

  try {
    // Verify the token using the secret key
    const decodedPayload = jwt.verify(req.body.token, key as Secret) as Record<
      string,
      any
    >;

    // Check if the payload contains all the required fields
    const requiredFields = [
      'name',
      'email',
      'sub',
      'userId',
      'clientId',
      'iat',
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const field of requiredFields) {
      if (!(field in decodedPayload)) {
        return res.status(400).json({
          error: `Missing field '${field}' in the token payload`,
        });
      }
    }

    // If verification succeeds and payload is valid, return the decoded payload
    res.status(200).json({ decodedPayload });
  } catch (error) {
    // If verification fails, return an error message
    res.status(401).json({ error: 'Invalid token' });
  }

  return res;
});

export default authRouter;
