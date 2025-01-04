FROM node:22-alpine AS build

WORKDIR /base

COPY package.json package-lock.json tsconfig.json ./
COPY shared/package.json shared/tsconfig.json shared/
COPY app/package.json app/tsconfig.json app/

# install deps
RUN npm install

# build shared library
COPY shared/index.ts shared/
RUN  npm run build --workspace=shared

# build app
COPY app/postcss.config.cjs app/
COPY app/next.config.mjs app/
COPY app/src app/src/
RUN npm run build --workspace=app

FROM nginx AS production

COPY --from=build /base/app/build /usr/share/nginx/html
COPY app/nginx.conf /etc/nginx/conf.d/groceries.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]