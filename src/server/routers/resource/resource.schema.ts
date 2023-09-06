import { z } from 'zod'

export const testConnectionSchema = z.union([
  z.object({
    type: z.literal('postgres'),
    url: z
      .string()
      .regex(
        /^postgresql:\/\/(?:([^:@]+)(?::([^@]*))?@)?([^:\/]+)(?::(\d{1,5}))?(?:\/(\w+))?(?:\?[a-zA-Z0-9%_\-=&]*)?$/,
      ),
  }),
  z.object({
    type: z.literal('mysql'),
    url: z.string().regex(/^mysql:\/\/([^:@]+):([^@]+)@([^:\/]+):(\d+)\/([\w\-]+)/),
  }),
])
