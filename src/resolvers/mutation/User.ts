import { GraphQLContext } from '../../context';

type UserCreateInput = {
  name: string;
  email: string;
};
type UserUpdateInput = {
  id: string;
} & UserCreateInput;
type UserDeleteInput = {
  id: string;
};

export const mutation = {
  createUser: (
    parent: unknown,
    args: UserCreateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
      },
    })},
  updateUser: (
    parent: unknown,
    args: UserUpdateInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.user.update({
      data: {
        name: args.name,
        email: args.email,
      },
      where: {
        id: args.id,
      },
    })},
  deleteUser: (
    parent: unknown,
    args: UserDeleteInput,
    context: GraphQLContext
  ) =>
    {return context.prisma.user.delete({
      where: {
        id: args.id,
      },
    })},
};

export default {
  mutation,
};
