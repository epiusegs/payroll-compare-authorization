import { Role } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  role: (
    parent: unknown,
    args: { id: string; clientId?: string },
    context: GraphQLContext
  ) => {
    return context.prisma.role.findUnique({
      where: {
        id: args.id,
        clientId: args.clientId,
      },
    });
  },
  roles: (
    parent: unknown,
    args: { clientId?: string },
    context: GraphQLContext
  ) => {
    return context.prisma.role.findMany({
      where: {
        clientId: args.clientId,
      },
    });
  },
};

export const resolver = {
  id: (parent: Role) => {
    return parent.id;
  },
  clientId: (parent: Role) => {
    return parent.clientId;
  },
  createdAt: (parent: Role) => {
    return parent.createdAt;
  },
  updatedAt: (parent: Role) => {
    return parent.updatedAt;
  },
  name: (parent: Role) => {
    return parent.name;
  },
  userRoles: (parent: Role, args: {}, context: GraphQLContext) => {
    return context.prisma.userRole.findMany({
      where: {
        roleId: parent.id,
      },
    });
  },
};

export default {
  query,
  resolver,
};
