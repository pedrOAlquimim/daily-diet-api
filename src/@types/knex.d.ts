// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    users: {
      id: string
      username: string
      email: string
      password: string
    }

    meals: {
      id: string
      title: string
      description: string
      time: Date
      is_on_the_diet: boolean
      user_id: string
    }
  }
}
