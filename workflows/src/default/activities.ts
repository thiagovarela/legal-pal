import type { SignUpInput, LoginInput } from '@gabo/schemas/input';
import { db } from '../db';
import { Argon2id } from 'oslo/password';
import { PostgresError } from 'postgres';
import {ApplicationFailure} from '@temporalio/activity';

export async function signUp(input: SignUpInput): Promise<string> {
  const user = await db.transaction().execute(async (trx) => {
    const user = await trx
      .insertInto('users')
      .values({
        first_name: input.first_name,
        last_name: input.last_name
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const argon2id = new Argon2id();
    const hash = await argon2id.hash(input.password);

    await trx
      .insertInto('user_credentials')
      .values({
        user_id: user.id,
        email: input.email,
        hashed_password: hash
      })
      .returningAll()
      .executeTakeFirst();

    return user;
  }).catch((error: PostgresError) => {    
    if (error.code == "23505") {
      throw ApplicationFailure.nonRetryable("Email already in use", "EmailInUseError");
    }
    throw ApplicationFailure.fromError(error);
  });
  return user.id;
}

export async function login(input: LoginInput): Promise<string> {
  const creds = await db
    .selectFrom('user_credentials')
    .selectAll()
    .where('email', '=', input.email)
    .executeTakeFirstOrThrow();
  const argon2id = new Argon2id();
  const validPassword = await argon2id.verify(creds.hashed_password, input.password);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }
  return creds.user_id;
}
