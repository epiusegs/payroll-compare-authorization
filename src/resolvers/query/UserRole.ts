import { UserRole } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  userRole: (
    parent: unknown,
    args: { id: string },
    context: GraphQLContext
  ) => {
    return context.prisma.userRole.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  userRoles: (
    parent: unknown,
    args: { userId?: string; roleId?: string },
    context: GraphQLContext
  ) => {
    return context.prisma.userRole.findMany({
      where: {
        userId: args.userId,
        roleId: args.roleId,
      },
    });
  },
};

export const resolver = {
  id: (parent: UserRole) => {
    return parent.id;
  },
  clientId: (parent: UserRole) => {
    return parent.clientId;
  },
  createdAt: (parent: UserRole) => {
    return parent.createdAt;
  },
  updatedAt: (parent: UserRole) => {
    return parent.updatedAt;
  },
  userId: (parent: UserRole) => {
    return parent.userId;
  },
  roleId: (parent: UserRole) => {
    return parent.roleId;
  },
  user: (parent: UserRole, args: {}, context: GraphQLContext) => {
    return context.prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
  role: (parent: UserRole, args: {}, context: GraphQLContext) => {
    return context.prisma.role.findUnique({
      where: {
        id: parent.roleId,
      },
    });
  },
};

export default {
  query,
  resolver,
};
