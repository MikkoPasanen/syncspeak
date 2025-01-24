FROM node:20.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# COPY localhost.crt /etc/nginx/cert/localhost.crt
# COPY localhost.key /etc/nginx/cert/localhost.key

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

# Start the web server
CMD ["nginx", "-g", "daemon off;"]