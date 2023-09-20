import { Account, AccountProviderIds } from '@prisma/client';
import { GraphQLContext } from '../../context';

export const query = {
  account: (parent: unknown, args: { id: string }, context: GraphQLContext) => {
    return context.prisma.account.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  accountByProvider: (
    parent: unknown,
    args: { provider: AccountProviderIds; providerAccountId: string },
    context: GraphQLContext
  ) => {
    return context.prisma.account.findUnique({
      where: {
        provider_providerAccountId: args,
      },
    });
  },
  accounts: (parent: unknown, args: {}, context: GraphQLContext) => {
    return context.prisma.account.findMany();
  },
};

export const resolver = {
  id: (parent: Account) => {
    return parent.id;
  },
  createdAt: (parent: Account) => {
    return parent.createdAt;
  },
  updatedAt: (parent: Account) => {
    return parent.updatedAt;
  },
  userId: (parent: Account) => {
    return parent.userId;
  },
  type: (parent: Account) => {
    return parent.type;
  },
  provider: (parent: Account) => {
    return parent.provider;
  },
  providerAccountId: (parent: Account) => {
    return parent.providerAccountId;
  },
  refresh_token: (parent: Account) => {
    return parent.refresh_token;
  },
  access_token: (parent: Account) => {
    return parent.access_token;
  },
  expires_at: (parent: Account) => {
    return parent.expires_at;
  },
  token_type: (parent: Account) => {
    return parent.token_type;
  },
  scope: (parent: Account) => {
    return parent.scope;
  },
  id_token: (parent: Account) => {
    return parent.id_token;
  },
  session_state: (parent: Account) => {
    return parent.session_state;
  },
  user: (parent: Account, args: {}, context: GraphQLContext) => {
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
