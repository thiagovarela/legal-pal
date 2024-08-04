import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Organizations {
  created_at: Generated<Timestamp>;
  flags: Json | null;
  id: Generated<string>;
  identifier: string;
  name: string | null;
  updated_at: Generated<Timestamp>;
}

export interface OrganizationUsers {
  created_at: Generated<Timestamp>;
  organization_id: string | null;
  role: string | null;
  updated_at: Generated<Timestamp>;
  user_id: string | null;
}

export interface SchemaMigrations {
  version: string;
}

export interface Sessions {
  created_at: Generated<Timestamp>;
  expires_at: Timestamp;
  id: Generated<string>;
  updated_at: Generated<Timestamp>;
  user_id: string;
}

export interface UserCredentials {
  created_at: Generated<Timestamp>;
  email: string;
  hashed_password: string;
  updated_at: Generated<Timestamp>;
  user_id: string;
}

export interface Users {
  created_at: Generated<Timestamp>;
  first_name: string;
  id: Generated<string>;
  last_name: string;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  organization_users: OrganizationUsers;
  organizations: Organizations;
  schema_migrations: SchemaMigrations;
  sessions: Sessions;
  user_credentials: UserCredentials;
  users: Users;
}
