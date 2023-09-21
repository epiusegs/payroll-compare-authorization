/* eslint-disable import/first */
import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import AWSXRay from 'aws-xray-sdk';

import { createYoga } from 'graphql-yoga';
import { applyMiddleware } from 'graphql-middleware';
import schema from './schema';
import logger, { logLevel } from './utils/logger';
import { createContext } from './context';
import { graphqlLogger, graphqlInputsLogger } from './utils/graphql-logger';

const PORT = process.env.PORT || 8080;

const app = express();
logger.level = 'info';

app.use(AWSXRay.express.openSegment('payroll-compare-authorization'));

app.use('/health', (_req, res) => {
  res.status(200).send({
    name: 'payroll-compare-authorization',
    message: 'Service is running',
  });
});
app.use('/api/health', (_req, res) => {
  res.status(200).send({
    name: 'payroll-compare-authorization',
    message: 'Service is running',
  });
});

const yoga = createYoga({
  schema: applyMiddleware(schema, graphqlLogger, graphqlInputsLogger),
  context: createContext,
});
app.use('/graphql', yoga);
app.use(AWSXRay.express.closeSegment());

app.listen(PORT, () => {
  logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  logger.level = logLevel;
});
