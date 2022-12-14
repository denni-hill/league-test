FROM node:16-alpine3.15

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci
RUN npm run build

ENV APPLICATION_NAME=
ENV APPLICATION_DESCRIPTION=
ENV VERSION=
ENV NODE_ENV=
ENV IP=
ENV PORT=

ENV DATABASE_HOST=
ENV DATABASE_PORT=
ENV DATABASE_NAME=
ENV DATABASE_USER=
ENV DATABASE_PASSWORD=

CMD ["npm", "run", "start:prod"]