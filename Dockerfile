FROM node:18-alpine

WORKDIR /netoviz
COPY . /netoviz/
RUN cp dot.env .env && npm install

EXPOSE 3000

# CMD NODE_ENV=production npm run start
CMD npm run dev
