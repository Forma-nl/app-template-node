// Run as a pre-sync hook before the new version starts serving. It must be safe
// to run twice: Argo will retry it if the sync is retried.
import pg from 'pg'

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
})

await client.connect()
await client.query('create table if not exists migrations (id serial primary key, name text unique not null, ran_at timestamptz not null default now())')
await client.end()

console.log(JSON.stringify({ level: 'info', message: 'migrations up to date' }))
