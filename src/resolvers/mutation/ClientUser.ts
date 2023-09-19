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
  ) =>
    {return context.prisma.clientUser.create({
      data: {
        clientId: args.clientId,
        userId: args.userId,
      },
    })},
  updateClientUser: (
    parent: unknown,
    args: ClientUserUpdateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.clientUser.update({
      data: {
        clientId: args.clientId,
        userId: args.userId,
      },
      where: {
        id: args.id,
      },
    })},
  deleteClientUser: (
    parent: unknown,
    args: ClientUserDeleteInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.clientUser.delete({
      where: {
        id: args.id,
      },
    })},
};

export default {
  mutation,
};
