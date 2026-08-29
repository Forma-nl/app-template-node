import { Worker } from 'bullmq'

// KEDA scales this deployment on the depth of the same queue, so the name here
// and the name in the chart's values have to agree.
const connection = {
  host: process.env.REDIS_HOST ?? 'valkey',
  port: Number(process.env.REDIS_PORT ?? 6379),
}

const worker = new Worker(process.env.QUEUE_NAME ?? 'default', async (job) => {
  console.log(JSON.stringify({ level: 'info', message: 'job', name: job.name, id: job.id }))
}, { connection })

worker.on('failed', (job, error) => {
  console.error(JSON.stringify({ level: 'error', message: error.message, job: job?.id }))
})

// Scaling to zero means the pod is stopped mid-life by design; finishing the
// job in hand before exiting is what keeps that safe.
process.on('SIGTERM', async () => { await worker.close(); process.exit(0) })
