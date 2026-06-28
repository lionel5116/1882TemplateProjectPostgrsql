# Build from backend directory: docker build -t 1882-backend .
#
# Run the container:
# docker run -d -p 8090:4000 \
#   -e DATABASE_URL=postgresql://postgres:5116@host.docker.internal:5432/1882costtrackingdb \
#   -e PORT=4000 \
#   -e HOURLY_RATE=50 \
#   1882-backend
#
# API available at: http://localhost:8090/api/
# Note: host.docker.internal routes to the Mac host where PostgreSQL is running
FROM node:22-alpine

WORKDIR /app

# Create stub for the file:.. dependency in package.json
RUN echo '{"name":"hisd-time-tracker","version":"1.0.0"}' > /package.json

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
