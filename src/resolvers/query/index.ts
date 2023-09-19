import { GraphQLSchema } from 'graphql';
import { addResolversToSchema } from '@graphql-tools/schema';
import Client from './Client';
import ClientUser from './ClientUser';
import Role from './Role';
import User from './User';
import UserRole from './UserRole';
import logger from '../../utils/logger';

const resolverComponents = [
  { name: 'Client', component: Client },
  { name: 'ClientUser', component: ClientUser },
  { name: 'Role', component: Role },
  { name: 'User', component: User },
  { name: 'UserRole', component: UserRole },
];

const resolvers = resolverComponents.reduce(
  (r, { name: componentName, component }) => {
    return {
      ...r,
      Query: {
        ...r.Query,
        ...component.query,
      },
      [componentName]: component.resolver,
    };
  },
  {
    Query: {
      health: () => {
        return 'GraphQL is running';
      },
    },
  }
);

export const loadQueryResolvers = (schema: GraphQLSchema): GraphQLSchema => {
  resolverComponents.forEach(({ name: componentName, component }) => {
    Object.entries(component.query).forEach(([queryName, queryResolver]) => {
      logger.info(`Loading query resolver ${componentName}/${queryName}`);

      try {
        addResolversToSchema({
          schema,
          resolvers: {
            Query: {
              [queryName]: queryResolver,
            },
          },
          updateResolversInPlace: true,
        });
      } catch (error: any) {
        logger.error(
          `Error while loading query resolver ${componentName}/${queryName}`
        );
        logger.error(error);
        throw error;
      }
    });

    Object.entries(component.resolver).forEach(([queryName, queryResolver]) => {
      logger.info(`Loading query resolver ${componentName}/${queryName}`);
      try {
        addResolversToSchema({
          schema,
          resolvers: {
            [componentName]: {
              [queryName]: queryResolver,
            },
          },
          updateResolversInPlace: true,
        });
      } catch (error: any) {
        logger.error(
          `Error while loading query resolver ${componentName}/${queryName}`
        );
        logger.error(error);
        throw error;
      }
    });
  });

  return schema;
};

export default resolvers;
