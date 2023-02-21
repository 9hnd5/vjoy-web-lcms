FROM node:18-alpine AS dependencies
ARG env

WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_ENV development
RUN yarn install --frozen-lockfile

FROM node:18-alpine AS builder
ARG env
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
RUN yarn build:${env}

FROM nginx:1.23-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV NODE_ENV production
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8080


