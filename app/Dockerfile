FROM node:22-alpine as build

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
COPY app/public app/public/
COPY app/src app/src/
RUN npm run build --workspace=app

FROM nginx as production

COPY --from=build /base/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]