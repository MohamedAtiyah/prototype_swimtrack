import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

let _pool: Pool | undefined
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Add your Neon connection string to .env.local."
      )
    }
    // Pool + neon-serverless supports transactions; neon-http does not.
    _pool = new Pool({ connectionString: url })
    _db = drizzle(_pool, { schema })
  }
  return _db
}
