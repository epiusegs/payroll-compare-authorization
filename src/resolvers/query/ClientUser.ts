import { ClientUser } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  clientUser: (
    parent: unknown,
    args: { id: string },
    context: GraphQLContext
  ) =>
    {return context.prisma.clientUser.findUnique({
      where: {
        id: args.id,
      },
    })},
  clientUsers: (
    parent: unknown,
    args: { clientId?: string; userId?: string },
    context: GraphQLContext
  ) =>
    {return context.prisma.clientUser.findMany({
      where: {
        clientId: args.clientId,
        userId: args.userId,
      },
    })},
};

export const resolver = {
  id: (parent: ClientUser) => {return parent.id},
  clientId: (parent: ClientUser) => {return parent.clientId},
  createdAt: (parent: ClientUser) => {return parent.createdAt},
  updatedAt: (parent: ClientUser) => {return parent.updatedAt},
  userId: (parent: ClientUser) => {return parent.userId},
  client: (parent: ClientUser, args: {}, context: GraphQLContext) =>
    {return context.prisma.client.findUnique({
      where: {
        id: parent.clientId,
      },
    })},
  user: (parent: ClientUser, args: {}, context: GraphQLContext) =>
    {return context.prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    })},
};

export default {
  query,
  resolver,
};
