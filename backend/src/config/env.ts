import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT_ENV: z.string(),
  DATABASE_URI: z.string()
})

const safeParsed = envSchema.safeParse(process.env)

if(!safeParsed.success) {
  console.error('Invalid environment variables:', safeParsed.error.format())
  process.exit(1)
}

const env = safeParsed.data

export const {
  NODE_ENV,
  PORT_ENV,
  DATABASE_URI,
} = env