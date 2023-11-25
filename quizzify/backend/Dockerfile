FROM node:18-alpine
ENV PORT 5000
WORKDIR /backend
COPY ./package.json ./

RUN npm install
COPY . ./
EXPOSE 5000
CMD ["npm", "run", "start"]