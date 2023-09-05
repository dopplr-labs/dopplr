'use client'

import { RouterIcon } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { BaseButton, Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const validationSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
})

export default function CreatePGResource() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      host: '',
      port: 5432,
      username: '',
      password: '',
      database: '',
    },
  })

  return (
    <Card className="max-w-screen-lg">
      <CardHeader>
        <CardTitle>Create Resource</CardTitle>
        <CardDescription>Enter database credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            onReset={() => {
              form.reset()
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                    <FormLabel>Host:</FormLabel>
                    <FormControl>
                      <Input className="col-span-2" {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                    <FormLabel>Port:</FormLabel>
                    <FormControl>
                      <Input className="col-span-2" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                    <FormLabel>Username:</FormLabel>
                    <FormControl>
                      <Input className="col-span-2" {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <Input className="col-span-2" {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="gap-4">
        <Button variant="outline" icon={<RouterIcon />}>
          Test Connection
        </Button>
        <div className="flex-1" />
        <BaseButton variant="secondary" asChild size="sm">
          <Link href="/resources">Cancel</Link>
        </BaseButton>
        <Button size="sm">Create</Button>
      </CardFooter>
    </Card>
  )
}
