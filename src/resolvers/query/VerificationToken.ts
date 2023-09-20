import { VerificationToken } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  verificationToken: (
    parent: unknown,
    args: { id: string },
    context: GraphQLContext
  ) => {
    return context.prisma.verificationToken.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  verificationTokens: (parent: unknown, args: {}, context: GraphQLContext) => {
    return context.prisma.verificationToken.findMany();
  },
};

export const resolver = {
  id: (parent: VerificationToken) => {
    return parent.id;
  },
  createdAt: (parent: VerificationToken) => {
    return parent.createdAt;
  },
  updatedAt: (parent: VerificationToken) => {
    return parent.updatedAt;
  },
  identifier: (parent: VerificationToken) => {
    return parent.id;
  },
  token: (parent: VerificationToken) => {
    return parent.token;
  },
  expires: (parent: VerificationToken) => {
    return parent.expires;
  },
};

export default {
  query,
  resolver,
};
