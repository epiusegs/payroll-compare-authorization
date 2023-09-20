import { GraphQLContext } from '../../context';

type ClientUserCreateInput = {
  clientId: string;
  userId: string;
};
type ClientUserUpdateInput = {
  id: string;
} & ClientUserCreateInput;
type ClientUserDeleteInput = {
  id: string;
};

export const mutation = {
  createClientUser: (
    parent: unknown,
    args: ClientUserCreateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.clientUser.create({
      data: args,
    });
  },
  createClientUsers: async (
    parent: unknown,
    args: {
      clientUsers: ClientUserCreateInput[];
    },
    context: GraphQLContext
  ) => {
    const response = await context.prisma.clientUser.createMany({
      data: args.clientUsers,
    });
    return {
      created: response.count,
    };
  },
  updateClientUser: (
    parent: unknown,
    args: ClientUserUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.clientUser.update({
      data: args,
      where: {
        id: args.id,
      },
    });
  },
  deleteClientUser: (
    parent: unknown,
    args: ClientUserDeleteInput,
    context: GraphQLContext
  ) => {
    return context.prisma.clientUser.delete({
      where: {
        id: args.id,
      },
    });
  },
  deleteClientUsers: async (
    parent: unknown,
    args: {
      clientUserIds: string[];
    },
    context: GraphQLContext
  ) => {
    const response = await context.prisma.clientUser.deleteMany({
      where: {
        id: {
          in: args.clientUserIds,
        },
      },
    });

    return {
      deleted: response.count,
    };
  },
};

export default {
  mutation,
};
