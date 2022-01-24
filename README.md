# wiredcraft-backend-challenge
Solution to the problem proposed by Wiredcraft as a backend challenge.
Link [here](https://github.com/Wiredcraft/test-backend).

# Setup Development Environment

Build needed containers:

```bash
docker compose up --build -d
```

Start:

```bash
docker compose start
```

Access `localhost:3000`.

Access logs:

```bash
docker logs --follow wiredcraft-backend-challenge-app-1
```

Run tests:

```bash
docker exec -ti wiredcraft-backend-challenge-app-1 npm run test

# or ...
docker exec -ti wiredcraft-backend-challenge-app-1 bash # get permanent terminal.
npm run test
```

# Build Image

Run:

```bash
docker build -t app:1.0.0 \
  --build-arg username=app \
  --build-arg uid=1001 \
  --build-arg gid=100 \
  --build-arg home=/home/app \
  --build-arg src=/home/app/src \
  .
```
