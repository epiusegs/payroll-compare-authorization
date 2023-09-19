import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import logger from '../../utils/logger';
import Client from './Client';
import ClientUser from './ClientUser';
import Role from './Role';
import User from './User';
import UserRole from './UserRole';

const muationComponents = [
  { name: 'Client', component: Client },
  { name: 'ClientUser', component: ClientUser },
  { name: 'Role', component: Role },
  { name: 'User', component: User },
  { name: 'UserRole', component: UserRole },
];

const muations = muationComponents.reduce(
  (r, { component }) => {
    return {
      ...r,
      Mutation: {
        ...r.Mutation,
        ...component.mutation,
      },
    };
  },
  {
    Mutation: {
      health: () => {
        return 'GraphQL is running';
      },
    },
  }
);

export const loadMutationResolvers = (schema: GraphQLSchema): GraphQLSchema => {
  muationComponents.forEach(({ name: componentName, component }) => {
    Object.entries(component.mutation).forEach(
      ([mutationName, mutationResolver]) => {
        logger.info(
          `Loading mutation resolver ${componentName}/${mutationName}`
        );

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

export default muations;
