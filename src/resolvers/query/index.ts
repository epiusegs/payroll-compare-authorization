import { GraphQLSchema } from 'graphql';
import { addResolversToSchema } from '@graphql-tools/schema';
import Account from './Account';
import Client from './Client';
import ClientUser from './ClientUser';
import Role from './Role';
import Session from './Session';
import User from './User';
import UserRole from './UserRole';
import VerificationToken from './VerificationToken';
import logger from '../../utils/logger';

const resolverComponents = [
  { name: 'Account', component: Account },
  { name: 'Client', component: Client },
  { name: 'ClientUser', component: ClientUser },
  { name: 'Role', component: Role },
  { name: 'Session', component: Session },
  { name: 'User', component: User },
  { name: 'UserRole', component: UserRole },
  { name: 'VerificationToken', component: VerificationToken },
];

export const loadQueryResolvers = (schema: GraphQLSchema): GraphQLSchema => {
  resolverComponents.forEach(({ name: componentName, component }) => {
    Object.entries(component.query).forEach(([queryName, queryResolver]) => {
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
        logger.info(`Loaded query resolver ${componentName}/${queryName}`);
      } catch (error: any) {
        logger.error(
          `Error while loading query resolver ${componentName}/${queryName}`
        );
        logger.error(error);
        throw error;
      }
    });

    Object.entries(component.resolver).forEach(([queryName, queryResolver]) => {
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
        logger.info(`Loaded query resolver ${componentName}/${queryName}`);
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
