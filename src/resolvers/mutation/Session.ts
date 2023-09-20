import { GraphQLContext } from '../../context';

type SessionCreateInput = {
  sessionToken: string;
  userId: string;
  expires: Date;
};
type SessionUpdateInput = {
  id: string;
} & SessionCreateInput;
type SessionDeleteInput = {
  id: string;
};
type SessionDeleteByTokenInput = {
  sessionToken: string;
};

export const mutation = {
  createSession: (
    parent: unknown,
    args: SessionCreateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.session.create({
      data: {
        ...args,
        id: args.sessionToken,
      },
    });
  },
  updateSession: (
    parent: unknown,
    args: SessionUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.session.update({
      data: args,
      where: {
        id: args.id,
      },
    });
  },
  updateSessionByToken: (
    parent: unknown,
    args: SessionUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.session.update({
      data: args,
      where: {
        sessionToken: args.sessionToken,
      },
    });
  },
  deleteSession: (
    parent: unknown,
    args: SessionDeleteInput,
    context: GraphQLContext
  ) => {
    return context.prisma.session.delete({
      where: {
        id: args.id,
      },
    });
  },
  deleteSessionByToken: (
    parent: unknown,
    args: SessionDeleteByTokenInput,
    context: GraphQLContext
  ) => {
    return context.prisma.session.delete({
      where: {
        sessionToken: args.sessionToken,
      },
    });
  },
};

export default {
  mutation,
};
