# run from monorepo base
FROM node:22-alpine AS build

WORKDIR /base

COPY package.json package-lock.json tsconfig.json ./
COPY shared/package.json shared/tsconfig.json shared/
COPY server/package.json server/tsconfig.json server/

# install deps
RUN npm install

# build shared library
COPY shared/ shared/
RUN  npm run build --workspace=shared

# build server
COPY server/src/ server/src/
RUN npm run build --workspace=server

# prod build
FROM node:22-alpine AS production

WORKDIR /opt/server

COPY server/package.json package-lock.json ./

RUN npm ci --omit=dev

# copy in built shared library AFTER npm ci otherwise it'll be overwritten with a symlink to the workspace
COPY --from=build /base/shared ./node_modules/@groceries/shared
COPY --from=build /base/server/dist ./dist

EXPOSE 80

CMD ["node", "/opt/server/dist/src/index.js"]