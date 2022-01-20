# wiredcraft-backend-challenge
Solution to the problem proposed by Wiredcraft as a backend challenge.
Link [here](https://github.com/Wiredcraft/test-backend).

# Setup Development Environment

Run:

```bash
docker compose --env-file .dockercompose.env up --build -d
```

Access `localhost:3000`.

Access logs:

```bash
docker logs --follow <container-name>
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
