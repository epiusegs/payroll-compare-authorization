import { User } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  user: (parent: unknown, args: { id: string }, context: GraphQLContext) => {
    return context.prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  users: (parent: unknown, args: {}, context: GraphQLContext) => {
    return context.prisma.user.findMany();
  },
};

export const resolver = {
  id: (parent: User) => {
    return parent.id;
  },
  createdAt: (parent: User) => {
    return parent.createdAt;
  },
  updatedAt: (parent: User) => {
    return parent.updatedAt;
  },
  name: (parent: User) => {
    return parent.name;
  },
  email: (parent: User) => {
    return parent.name;
  },
  selectedClientId: (parent: User) => {
    return parent.name;
  },
  selectedClient: (parent: User, args: {}, context: GraphQLContext) => {
    if (!parent.selectedClientId) {
      return Promise.resolve(null);
    }

    return context.prisma.client.findUnique({
      where: {
        id: parent.selectedClientId,
      },
    });
  },
  clientUsers: (parent: User, args: {}, context: GraphQLContext) => {
    return context.prisma.clientUser.findMany({
      where: {
        userId: parent.id,
      },
    });
  },
  userRoles: (parent: User, args: {}, context: GraphQLContext) => {
    return context.prisma.userRole.findMany({
      where: {
        userId: parent.id,
      },
    });
  },
};

export default {
  query,
  resolver,
};
