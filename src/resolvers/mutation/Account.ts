import { GraphQLContext } from '../../context';

type AccountProviderType = 'oauth' | 'email' | 'credentials';
type AccountProviderIds = 'cognito';

type AccountCreateInput = {
  userId: string;
  type: AccountProviderType;
  provider: AccountProviderIds;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
};
type AccountUpdateInput = {
  id: string;
} & AccountCreateInput;
type AccountDeleteInput = {
  id: string;
};
type AccountDeleteByProviderInput = {
  provider: AccountProviderIds;
  providerAccountId: string;
};

export const mutation = {
  createAccount: (
    parent: unknown,
    args: AccountCreateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.account.create({
      data: args,
    });
  },
  updateAccount: (
    parent: unknown,
    args: AccountUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.account.update({
      data: args,
      where: {
        id: args.id,
      },
    });
  },
  deleteAccount: (
    parent: unknown,
    args: AccountDeleteInput,
    context: GraphQLContext
  ) => {
    return context.prisma.account.delete({
      where: {
        id: args.id,
      },
    });
  },
  deleteAccountByProvider: (
    parent: unknown,
    args: AccountDeleteByProviderInput,
    context: GraphQLContext
  ) => {
    return context.prisma.account.delete({
      where: {
        provider_providerAccountId: args,
      },
    });
  },
};

export default {
  mutation,
};
