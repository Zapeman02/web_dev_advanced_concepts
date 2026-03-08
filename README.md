# Setup Guide

## Prerequisites

- Docker running

## Migrating from the old setup guide

If you've followed the old setup guide, remove the old containers and image first:

```bash
docker rm -f project-postgres-container
docker image rm project-postgres-image
```

## Run with Docker

**1. Create a network**

```bash
docker network create project-network
```

**2. Build and start the Postgres container**

```bash
docker build -f Dockerfile.postgres -t project-postgres-image .
docker run -d --name project-postgres-container --network project-network project-postgres-image
```

> If you've run this before, just do `docker start project-postgres-container`

**3. Build and start the Node container**

```bash
docker build -f Dockerfile.node -t project-node-image .
docker run -d -p 8080:8080 --name project-node-container --network project-network project-node-image
```

> If you've run this before, just do `docker start project-node-container`

**4. Verify start of server went well**

```bash
docker logs project-node-container
```

Output should be:

```
Connected to DB
setting up DB
Venues table created with opening_hours column
Users created!
testuser created
DB is setup
Server is running on http://127.0.0.1:8080...
```

The server will automatically set up the database and start.

Server runs on http://127.0.0.1:8080

## Updating the server after code changes

Rebuild the Node image and restart the container:

```bash
docker build -f Dockerfile.node -t project-node-image .
docker rm -f project-node-container
docker run -d -p 8080:8080 --name project-node-container --network project-network project-node-image
```
