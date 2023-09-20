import { GraphQLContext } from '../../context';

type ClientCreateInput = {
  name: string;
};
type ClientUpdateInput = {
  id: string;
} & ClientCreateInput;
type ClientDeleteInput = {
  id: string;
};

export const mutation = {
  createClient: (
    parent: unknown,
    args: ClientCreateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.client.create({
      data: args,
    });
  },
  updateClient: (
    parent: unknown,
    args: ClientUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.client.update({
      data: args,
      where: {
        id: args.id,
      },
    });
  },
  deleteClient: (
    parent: unknown,
    args: ClientDeleteInput,
    context: GraphQLContext
  ) => {
    return context.prisma.client.delete({
      where: {
        id: args.id,
      },
    });
  },
};

export default {
  mutation,
};
