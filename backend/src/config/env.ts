import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT_ENV: z.string(),
  DATABASE_URI: z.string(),
  SALT_ROUNDS: z.string().transform((val): number => parseInt(val, 10)),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string()
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
  SALT_ROUNDS,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = env