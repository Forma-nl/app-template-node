import { createServer } from 'node:http'

// The chart probes /up on every runtime; keeping the path identical means the
// platform never has to know which runtime it is looking at.
const PORT = Number(process.env.PORT ?? 8080)

const server = createServer((request, response) => {
  if (request.url === '/up') {
    response.writeHead(200, { 'content-type': 'application/json' })
    response.end(JSON.stringify({ status: 'ok', environment: process.env.APP_ENV ?? 'production' }))
    return
  }

  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  response.end(`<!doctype html>
<meta charset="utf-8">
<title>${process.env.APP_NAME ?? 'Application'}</title>
<style>body{font:16px/1.6 system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#F4F5F6;color:#1B202B}main{text-align:center}code{background:#fff;border:1px solid #E4E6E9;border-radius:6px;padding:2px 6px}</style>
<main>
  <h1>${process.env.APP_NAME ?? 'Application'}</h1>
  <p>Running on CloudApps in the <b>${process.env.APP_ENV ?? 'production'}</b> environment.</p>
  <p>Push to this branch and it deploys. Health is at <code>/up</code>.</p>
</main>`)
})

server.listen(PORT, () => console.log(JSON.stringify({ level: 'info', message: `listening on ${PORT}` })))

// Kubernetes sends SIGTERM and then waits; closing the listener lets in-flight
// requests finish instead of being cut off at the deadline.
const shutdown = () => server.close(() => process.exit(0))
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
