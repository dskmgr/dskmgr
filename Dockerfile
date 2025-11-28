FROM node:lts-trixie AS build

# set working directory
WORKDIR /src

# copy all files
COPY . .

# set CI environment variable to true
ENV CI=true

# install pnpm
RUN npm install -g pnpm

# install dependencies
RUN pnpm install --frozen-lockfile

RUN pnpm run build:server

FROM node:lts-alpine AS runtime

EXPOSE 80
WORKDIR /app

ENV PORT=80
ENV NODE_ENV=production

COPY --from=build /src/build-node .

CMD ["node", "."]
