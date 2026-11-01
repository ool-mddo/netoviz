FROM node:24.22.2-alpine

WORKDIR /netoviz
COPY . /netoviz/
RUN cp dot.env .env && npm install --omit=dev && npm cache clean --force

EXPOSE 3000

# CMD ["npm", "run", "start"]
CMD ["npm", "run", "dev"]
