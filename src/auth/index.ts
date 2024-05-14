import { Router, json } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { PrismaClient } from '@prisma/client';

const authRouter: Router = Router();
const prisma = new PrismaClient();
const parseJSON = json();
authRouter.use(parseJSON);
// Configure Cognito user pool
const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USERPOOLID as string,
  ClientId: process.env.COGNITO_CLIENTID as string,
});

authRouter.post('/login', async (req, res) => {
  const key: Secret | undefined = process.env.ACCESS_KEY;
  const { username } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: req.body.username },
  });

  if (!user) {
    res.status(501).json({
      error:
        'User has not been created yet. This probably means they have not signed in yet.',
    });
    return;
  }

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
    onSuccess: () => {
      const options: jwt.SignOptions = {
        header: { alg: 'HS256' },
      };
      const load = {
        name: user.email,
        email: user.email,
        picture: null,
        sub: user.id,
        userId: user.id,
        clientId: user.selectedClientId,
      };

      const jwtToken = jwt.sign(load, key as string, options);
      res.status(200).send(jwtToken);
    },
    onFailure: (err) => {
      // Authentication failed
      res.status(401).json({
        error: 'Authentication failed',
        code: err.code,
        nestedError: err,
      });
      // eslint-disable-next-line prefer-template
      console.error('Authentication failed due to ' + err.message);
    },
    newPasswordRequired: () => {
      // Set the new password for the user
      res.status(400).json({ challenge: 'NEW_PASSWORD_REQUIRED' });
    },
  });
});

authRouter.post('/newpassword', async (req, res) => {
  const key: Secret | undefined = process.env.ACCESS_KEY;
  const { username, newPassword = '' } = req.body;

  // Create Cognito user object
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const user = await prisma.user.findUnique({
    where: { email: req.body.username },
  });

  if (!user) {
    res.status(501).json({
      error:
        'User has not been created yet. This probably means they have not signed in yet.',
    });
    return;
  }

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.completeNewPasswordChallenge(newPassword, null, {
    onSuccess: () => {
      // Password updated successfully, generate a session token
      const options: jwt.SignOptions = {
        header: { alg: 'HS256' },
      };
      const load = {
        name: user.email,
        email: user.email,
        picture: null,
        sub: user.id,
        userId: user.id,
        clientId: user.selectedClientId,
      };

      const jwtToken = jwt.sign(load, key as string, options);
      res.status(200).send(jwtToken);
    },
    onFailure: (err) => {
      console.error({ error: err });
      res.status(500).json({ error: 'Error setting new password' });
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

    // If verification succeeds and payload is valid, return the decoded payload
    res.status(200).json({ decodedPayload });
  } catch (error) {
    // If verification fails, return an error message
    res.status(401).json({ error: 'Invalid token' });
  }

  return res;
});

export default authRouter;
