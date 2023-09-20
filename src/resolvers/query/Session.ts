import { Session } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  session: (parent: unknown, args: { id: string }, context: GraphQLContext) => {
    return context.prisma.session.findUnique({
      where: args,
    });
  },
  sessionByToken: (
    parent: unknown,
    args: { sessionToken: string },
    context: GraphQLContext
  ) => {
    return context.prisma.session.findUnique({
      where: args,
    });
  },
  sessions: (parent: unknown, args: {}, context: GraphQLContext) => {
    return context.prisma.session.findMany();
  },
};

export const resolver = {
  id: (parent: Session) => {
    return parent.id;
  },
  createdAt: (parent: Session) => {
    return parent.createdAt;
  },
  updatedAt: (parent: Session) => {
    return parent.updatedAt;
  },
  sessionToken: (parent: Session) => {
    return parent.sessionToken;
  },
  userId: (parent: Session) => {
    return parent.userId;
  },
  expires: (parent: Session) => {
    return parent.expires;
  },
  user: (parent: Session, args: {}, context: GraphQLContext) => {
    return context.prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
};

export default {
  query,
  resolver,
};
