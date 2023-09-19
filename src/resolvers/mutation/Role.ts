import { GraphQLContext } from '../../context';

type RoleCreateInput = {
  clientId: string;
  name: string;
};
type RoleUpdateInput = {
  id: string;
} & RoleCreateInput;
type RoleDeleteInput = {
  id: string;
};

export const mutation = {
  createRole: (
    parent: unknown,
    args: RoleCreateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.role.create({
      data: {
        clientId: args.clientId,
        name: args.name,
      },
    })},
  updateRole: (
    parent: unknown,
    args: RoleUpdateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.role.update({
      data: {
        clientId: args.clientId,
        name: args.name,
      },
      where: {
        id: args.id,
      },
    })},
  deleteRole: (
    parent: unknown,
    args: RoleDeleteInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.role.delete({
      where: {
        id: args.id,
      },
    })},
};

export default {
  mutation,
};
