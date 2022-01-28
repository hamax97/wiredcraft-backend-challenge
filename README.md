# wiredcraft-backend-challenge
Solution to the problem proposed by Wiredcraft as a backend challenge.
Link [here](https://github.com/Wiredcraft/test-backend).

# Setup Development Environment

Build needed containers:

```bash
docker compose up -d
```

Start:

```bash
docker compose start
```

Run application in watch mode:

```bash
npm run start:watch
```

Run tests:

```bash
npm run test
```

# Build Image

Run:

```bash
docker build -t app:1.0.0 .
```
