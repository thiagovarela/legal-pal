temporal:
    temporal server start-dev --db-filename temporal.db

db:
    docker compose up -d

app:
    pnpm run -C app dev

worker:
    pnpm run -C workflows worker:default