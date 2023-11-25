FROM node:18-alpine
ENV PORT 3000
WORKDIR /frontend
COPY ./package.json ./

RUN npm install
COPY . ./
EXPOSE 3000
RUN npm run build

CMD ["npm", "run", "start"]