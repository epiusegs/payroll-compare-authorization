import { Client } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  client: (parent: unknown, args: { id: string }, context: GraphQLContext) =>
    {return context.prisma.client.findUnique({
      where: {
        id: args.id,
      },
    })},
  clients: (parent: unknown, args: {}, context: GraphQLContext) =>
    {return context.prisma.client.findMany()},
};

export const resolver = {
  id: (parent: Client) => {return parent.id},
  createdAt: (parent: Client) => {return parent.createdAt},
  updatedAt: (parent: Client) => {return parent.updatedAt},
  name: (parent: Client) => {return parent.name},
  clientUsers: (parent: Client, args: {}, context: GraphQLContext) =>
    {return context.prisma.clientUser.findMany({
      where: {
        clientId: parent.id,
      },
      include: {
        user: true,
      },
    })},
};

export default {
  query,
  resolver,
};
