import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import logger from '../../utils/logger';
import Account from './Account';
import Client from './Client';
import ClientUser from './ClientUser';
import Role from './Role';
import Session from './Session';
import User from './User';
import UserRole from './UserRole';
import VerificationToken from './VerificationToken';

const muationComponents = [
  { name: 'Account', component: Account },
  { name: 'Client', component: Client },
  { name: 'ClientUser', component: ClientUser },
  { name: 'Role', component: Role },
  { name: 'Session', component: Session },
  { name: 'User', component: User },
  { name: 'UserRole', component: UserRole },
  { name: 'VerificationToken', component: VerificationToken },
];

export const loadMutationResolvers = (schema: GraphQLSchema): GraphQLSchema => {
  muationComponents.forEach(({ name: componentName, component }) => {
    Object.entries(component.mutation).forEach(
      ([mutationName, mutationResolver]) => {
        try {
          addResolversToSchema({
            schema,
            resolvers: {
              Mutation: {
                [mutationName]: mutationResolver,
              },
            },
            updateResolversInPlace: true,
          });
          logger.info(
            `Loaded mutation resolver ${componentName}/${mutationName}`
          );
        } catch (error: any) {
          logger.error(
            `Error while loading mutation resolver ${componentName}/${mutationName}`
          );
          logger.error(error);
          throw error;
        }
      }
    );
  });

  return schema;
};
