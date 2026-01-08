# build stage
FROM node:20-alpine AS build

WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm ci

# copy source code
COPY . .

# set api url at build time (can override with env var)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# build the app
RUN npm run build

# production stage - serve with nginx
FROM nginx:alpine

# copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# copy nginx config for spa routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]