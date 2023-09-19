import { GraphQLContext } from '../../context';

type UserRoleCreateInput = {
  userId: string;
  roleId: string;
};
type UserRoleUpdateInput = {
  id: string;
} & UserRoleCreateInput;
type UserRoleDeleteInput = {
  id: string;
};

export const mutation = {
  createUserRole: (
    parent: unknown,
    args: UserRoleCreateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.userRole.create({
      data: {
        userId: args.userId,
        roleId: args.roleId,
      },
    })},
  updateUserRole: (
    parent: unknown,
    args: UserRoleUpdateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.userRole.update({
      data: {
        userId: args.userId,
        roleId: args.roleId,
      },
      where: {
        id: args.id,
      },
    })},
  deleteUserRole: (
    parent: unknown,
    args: UserRoleDeleteInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.userRole.delete({
      where: {
        id: args.id,
      },
    })},
};

export default {
  mutation,
};
