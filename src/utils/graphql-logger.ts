import graphqlPinoMiddleware from 'graphql-pino-middleware';
import pinoLogger from './logger';

export const graphqlLogger = graphqlPinoMiddleware({
  logger: pinoLogger,
});

export const graphqlInputsLogger = async (
  resolve: any,
  parent: any,
  args: any,
  ctx: any,
  info: any
) => {
  pinoLogger.info(
    `GraphQL received for ${info?.fieldName} in operation ${info?.operation?.name?.value}.`
  );
  return resolve();
};

export default graphqlLogger;
