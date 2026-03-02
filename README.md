# Setup Guide

## Prerequisites
- Docker running
- Node.js installed

## Steps

**1. Install dependencies**
```bash
npm install
```

**2. Start the Postgres container**
```bash
docker build -t project-postgres-image .
docker run -d -p 5432:5432 --name project-postgres-container project-postgres-image
```
> If you've run this before, just do `docker start project-postgres-container`

**3. Set up the database**
```bash
node db/db-setup.js
```

**4. Start the server**
```bash
node server.js
```

Server runs on http://127.0.0.1:8080
