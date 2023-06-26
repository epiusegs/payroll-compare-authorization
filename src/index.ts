/* eslint-disable import/first */
import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import logger, { expressLogger, logLevel } from './utils/logger';
import apiRouter from './api-router';

const PORT = process.env.PORT || 8080;

const app = express();
logger.level = 'info';
app.use(expressLogger);

app.use('/health', (_req, res) => {
  res.status(200).send({
    name: 'lifion-generic-entity-viewer',
    message: 'Service is running',
  });
});

app.use(expressLogger);
app.use('/api', apiRouter);

app.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`);
  logger.level = logLevel;
});
