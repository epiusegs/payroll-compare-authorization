import { GraphQLContext } from '../../context';

type VerificationTokenCreateInput = {
  identifier: string;
  token: string;
  expires: Date;
};
type VerificationTokenUpdateInput = {
  id: string;
} & VerificationTokenCreateInput;
type VerificationTokenDeleteInput = {
  id: string;
};

export const mutation = {
  createVerificationToken: (
    parent: unknown,
    args: VerificationTokenCreateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.verificationToken.create({
      data: {
        ...args,
        id: args.identifier,
      },
    });
  },
  updateVerificationToken: (
    parent: unknown,
    args: VerificationTokenUpdateInput,
    context: GraphQLContext
  ) => {
    return context.prisma.verificationToken.update({
      data: args,
      where: {
        id: args.id,
      },
    });
  },
  deleteVerificationToken: (
    parent: unknown,
    args: VerificationTokenDeleteInput,
    context: GraphQLContext
  ) => {
    return context.prisma.verificationToken.delete({
      where: {
        id: args.id,
      },
    });
  },
};

export default {
  mutation,
};
