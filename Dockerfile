FROM node:20-alpine3.18

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./app/

RUN npm install -g pnpm@8.6.11 && pnpm install

COPY . /swift

EXPOSE 8000

RUN pnpm run build

CMD ["pnpm", "run", "start"]

