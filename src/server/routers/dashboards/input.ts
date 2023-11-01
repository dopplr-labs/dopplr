import z from 'zod'

export const createDashboardInput = z.object({
  name: z
    .string({ required_error: 'Please enter name of dashboard!' })
    .min(5, 'Please enter at least 5 characters!')
    .max(200, 'Please enter at most 200 characters!'),
  description: z.string().max(1000, 'Please enter at most 1000 characters!').optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  layout: z.any().optional(),
})

export const updateDashboardInput = createDashboardInput.partial().extend({
  id: z.number(),
})
