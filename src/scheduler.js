// One replica, started by the chart. There is no crontab on the node to keep in
// sync, so anything periodic belongs here.
const MINUTE = 60_000

setInterval(() => {
  console.log(JSON.stringify({ level: 'info', message: 'tick', at: new Date().toISOString() }))
}, MINUTE)

process.on('SIGTERM', () => process.exit(0))
