import { SquareClient, SquareEnvironment } from 'square'

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('Missing SQUARE_ACCESS_TOKEN environment variable')
}

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
})

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || ''
