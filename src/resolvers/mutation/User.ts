import { GraphQLContext } from '../../context';

type UserCreateInput = {
  name: string;
  email: string;
  emailVerified: string;
  image: string;
};
type UserUpdateInput = {
  id: string;
} & UserCreateInput;
type UserDeleteInput = {
  id: string;
};
type UserSelectClientInput = {
  userId: string;
  clientId: string;
};

export const mutation = {
  createUser: (
    parent: unknown,
    args: UserCreateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.user.create({
      data: args,
    });
  },
  updateUser: (
    parent: unknown,
    args: UserUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.user.update({
      data: args,
      where: {
        id: args.id,
      },
    });
  },
  deleteUser: (
    parent: unknown,
    args: UserDeleteInput,
    context: GraphQLContext
  ) => {
    return context.prisma.user.delete({
      where: {
        id: args.id,
      },
    });
  },
  selectClient: (
    parent: unknown,
    args: UserSelectClientInput,
    context: GraphQLContext
  ) => {
    return context.prisma.user.update({
      data: {
        selectedClientId: args.clientId,
      },
      where: {
        id: args.userId,
      },
    });
  },
};

export default {
  mutation,
};
