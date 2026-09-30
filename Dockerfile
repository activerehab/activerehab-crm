FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production
ENV PORT=10000

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate
RUN npx prisma db push
RUN node prisma/seed.js

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["npm", "start"]
