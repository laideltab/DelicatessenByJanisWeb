import { SquareError } from "square"

export class SquareApiError extends Error {
  readonly statusCode?: number
  readonly category?: string
  readonly code?: string
  readonly detail?: string
  readonly cause?: unknown

  constructor(message: string, opts?: {
    statusCode?: number
    category?: string
    code?: string
    detail?: string
    cause?: unknown
  }) {
    super(message)
    this.name = "SquareApiError"
    this.statusCode = opts?.statusCode
    this.category = opts?.category
    this.code = opts?.code
    this.detail = opts?.detail
    this.cause = opts?.cause
  }
}

export async function withSquare<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof SquareError) {
      const first = err.errors?.[0]
      throw new SquareApiError(
        `Square ${label} failed: ${first?.detail ?? err.message}`,
        {
          statusCode: err.statusCode,
          category: first?.category,
          code: first?.code,
          detail: first?.detail,
          cause: err,
        },
      )
    }
    throw err instanceof Error
      ? new SquareApiError(`Square ${label} failed: ${err.message}`, { cause: err })
      : new SquareApiError(`Square ${label} failed`, { cause: err })
  }
}
