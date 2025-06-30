export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeObservability } = await import('@workspace/observability')
    initializeObservability()
  }
}