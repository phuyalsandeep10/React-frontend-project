# Step 1: Use a Node.js image to build the React app
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React application
RUN npm run build

# Step 2: Use an nginx image to serve the built app
FROM nginx:alpine

# Copy the built React app to the nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
