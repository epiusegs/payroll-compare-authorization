import { Router, json } from 'express';
import jwt from 'jsonwebtoken';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import logger from '../utils/logger';
import { prismaClient } from '../utils/prisma-client';

const authRouter: Router = Router();
authRouter.use(json());

const JWT_SECRET = process.env.JWT_SECRET!;
const COGNITO_USERPOOLID = process.env.COGNITO_USERPOOLID!;
const COGNITO_CLIENTID = process.env.COGNITO_CLIENTID!;

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_USERPOOLID,
  ClientId: COGNITO_CLIENTID,
});

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Create authentication details
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  // Create Cognito user object
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  // Authenticate user
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: async () => {
      const user = await prismaClient.user.findUnique({
        where: { email: req.body.username },
      });

      if (!user) {
        res.status(422).json({
          code: 'USER_DOES_NOT_EXIST',
          message:
            'User has not been created yet. This probably means they have not signed in yet.',
        });
        return;
      }

      const jwtToken = jwt.sign(
        {
          name: user.email,
          email: user.email,
          picture: null,
          sub: user.id,
          userId: user.id,
          clientId: user.selectedClientId,
        },
        JWT_SECRET,
        {
          header: { alg: 'HS256' },
        }
      );
      res.status(200).send(jwtToken);
    },
    onFailure: (error: any) => {
      // Authentication failed
      res.status(401).json({
        code: error.code ?? 'UNEXPECTED_LOGIN_ERROR',
        message: error.message ?? 'Unexpected error occurred during login',
        nestedError: error,
      });

      logger.error(
        `Authentication failed due to ${error.code}-${error.message}`
      );
    },
    newPasswordRequired: () => {
      // Set the new password for the user
      res.status(409).json({
        code: 'NEXT_CHALLENGE',
        challenge: 'NEW_PASSWORD_REQUIRED',
      });
    },
  });
});

authRouter.post('/newpassword', async (req, res) => {
  const { username, token, newPassword } = req.body;

  if (!username) {
    res.status(501).json({
      error: 'Username not provided in body.',
    });
    return;
  }

  if (!token) {
    res.status(501).json({
      error: 'Token not provided in body.',
    });
    return;
  }

  if (!newPassword) {
    res.status(501).json({
      error: 'New Password not provided in body.',
    });
    return;
  }

  try {
    // Verify the token using the secret key
    const decodedPayload = jwt.verify(req.body.token, JWT_SECRET);

    if (
      typeof decodedPayload === 'string' ||
      decodedPayload.email !== username
    ) {
      res.status(402).json({ error: 'Token is not for provided username' });
      return;
    }
  } catch (error) {
    // If verification fails, return an error message
    res.status(401).json({ error: 'Invalid token' });
  }

  // Create Cognito user object
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  cognitoUser.completeNewPasswordChallenge(newPassword, null, {
    onSuccess: async () => {
      const user = await prismaClient.user.findUnique({
        where: { email: req.body.username },
      });

      if (!user) {
        res.status(501).json({
          error:
            'User has not been created yet. This probably means they have not signed in yet.',
        });
        return;
      }

      // Password updated successfully, generate a session token
      const jwtToken = jwt.sign(
        {
          name: user.email,
          email: user.email,
          picture: null,
          sub: user.id,
          userId: user.id,
          clientId: user.selectedClientId,
        },
        JWT_SECRET,
        {
          header: { alg: 'HS256' },
        }
      );
      res.status(200).send(jwtToken);
    },
    onFailure: (err) => {
      logger.error({ error: err });
      res.status(500).json({ error: 'Error setting new password' });
    },
  });
});

authRouter.post('/verify', (req, res) => {
  if (!req.body.token) {
    return res
      .status(400)
      .json({ error: 'Token is missing in the request body' });
  }

  try {
    // Verify the token using the secret key
    const decodedPayload = jwt.verify(req.body.token, JWT_SECRET);

    // If verification succeeds and payload is valid, return the decoded payload
    res.status(200).json({ decodedPayload });
  } catch (error) {
    // If verification fails, return an error message
    res.status(401).json({ error: 'Invalid token' });
  }

  return res;
});

export default authRouter;
