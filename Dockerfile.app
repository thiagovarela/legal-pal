FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /builder
WORKDIR /builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -C app run build

# Main App
FROM base AS app
COPY --from=build /builder/app/build /app/build
COPY --from=build /builder/app/package.json /app/build
WORKDIR /app
EXPOSE 3000
CMD ["node", "/app/build/index.js"]
