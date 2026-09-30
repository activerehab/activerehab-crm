FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

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
