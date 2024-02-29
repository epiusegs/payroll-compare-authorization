# STAGE 1
FROM public.ecr.aws/b2r7m8f2/node:20 as ts-compiler
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
# copy source
COPY --chown=node:node  . ./
# build backend
RUN npm run generate
RUN npm run build
RUN npm run copyfiles

FROM public.ecr.aws/b2r7m8f2/node:20 as ts-remover
WORKDIR /home/node/app
COPY --from=ts-compiler /home/node/app/package*.json ./
RUN npm install --omit=dev
COPY --from=ts-compiler /home/node/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=ts-compiler /home/node/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=ts-compiler /home/node/app/dist ./dist

FROM public.ecr.aws/b2r7m8f2/node:20 as production
WORKDIR /home/node/app
COPY --from=ts-remover /home/node/app ./
USER 1000

EXPOSE 8080
CMD ["node", "dist/index.js"]