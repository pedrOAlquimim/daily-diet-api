import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_FILE,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
  },
}

export const knex = setupKnex(knexConfig)
