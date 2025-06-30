import { trace, context, SpanStatusCode } from '@opentelemetry/api'
import type { Span, SpanOptions, AttributeValue } from '@opentelemetry/api'

const tracer = trace.getTracer('@workspace/observability', '0.0.0')

export function createSpan(name: string, options?: SpanOptions): Span {
  return tracer.startSpan(name, options)
}

export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  options?: SpanOptions
): Promise<T> {
  const span = createSpan(name, options)

  try {
    const result = await context.with(trace.setSpan(context.active(), span), () => fn(span))
    span.setStatus({ code: SpanStatusCode.OK })
    return result
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    span.recordException(error as Error)
    throw error
  } finally {
    span.end()
  }
}

export function withSpanSync<T>(
  name: string,
  fn: (span: Span) => T,
  options?: SpanOptions
): T {
  const span = createSpan(name, options)

  try {
    const result = context.with(trace.setSpan(context.active(), span), () => fn(span))
    span.setStatus({ code: SpanStatusCode.OK })
    return result
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    span.recordException(error as Error)
    throw error
  } finally {
    span.end()
  }
}

export function setSpanAttribute(span: Span, key: string, value: AttributeValue): void {
  span.setAttribute(key, value)
}

export function setSpanAttributes(span: Span, attributes: Record<string, AttributeValue>): void {
  Object.entries(attributes).forEach(([key, value]) => {
    span.setAttribute(key, value)
  })
}