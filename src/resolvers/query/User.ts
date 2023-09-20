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
  usersNotRelatedToClient: async (
    parent: unknown,
    args: { clientId: string },
    context: GraphQLContext
  ) => {
    const usersInClient = await context.prisma.clientUser.findMany({
      select: {
        userId: true,
      },
      where: {
        clientId: args.clientId,
      },
      distinct: 'userId',
    });

    return context.prisma.user.findMany({
      where: {
        id: {
          notIn: usersInClient.map((cu) => {
            return cu.userId;
          }),
        },
      },
    });
  },
  userByEmail: (
    parent: unknown,
    args: { email: string },
    context: GraphQLContext
  ) => {
    return context.prisma.user.findUnique({
      where: {
        email: args.email,
      },
    });
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
    return parent.email;
  },
  selectedClientId: (parent: User) => {
    return parent.selectedClientId;
  },
  emailVerified: (parent: User) => {
    return parent.emailVerified;
  },
  image: (parent: User) => {
    return parent.image;
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
