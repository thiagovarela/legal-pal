FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# satisfies build time check of variable
ENV DATABASE_URL="postgres://l:l@l/l"  
ENV TEMPORAL_URL="http://localhost"

FROM base AS build
COPY . /builder
WORKDIR /builder
RUN --mount=type=cache,id=s/260bdcd2-c9d7-4d87-968e-2913aae34a6e-/pnpm/store,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -C app run build
RUN pnpm --filter=app --prod deploy ./app/packages


# Main App
FROM base AS app
WORKDIR /app
COPY --from=build /builder/app/packages .
COPY --from=build /builder/app/build .
COPY --from=build /builder/app/package.json .

EXPOSE 3000
CMD ["node", "/app/index.js"]
