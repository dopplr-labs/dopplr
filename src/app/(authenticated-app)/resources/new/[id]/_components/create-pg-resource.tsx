'use client'

import { CheckCircle2Icon, ZapIcon } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { BaseButton, Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'

const validationSchema = z.discriminatedUnion('config', [
  z.object({
    config: z.literal('url'),
    url: z
      .string()
      .nonempty()
      .regex(
        /^postgresql:\/\/(?:([^:@]+)(?::([^@]*))?@)?([^:\/]+)(?::(\d{1,5}))?(?:\/(\w+))?(?:\?[a-zA-Z0-9%_\-=&]*)?$/,
      ),
  }),
  z.object({
    config: z.literal('fields'),
    host: z.string().nonempty(),
    port: z.coerce.number({ invalid_type_error: 'Port must be a number ' }).positive({
      message: 'Port must be a positive number',
    }),
    dbUsername: z.string().nonempty(),
    dbPassword: z.string().nonempty(),
    database: z.string().nonempty(),
  }),
])

export default function CreatePGResource() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      url: '',
      config: 'url',
      // @ts-expect-error
      host: '',
      port: '',
      dbUsername: '',
      dbPassword: '',
      database: '',
    },
  })

  const { config } = useWatch(form)

  const { toast } = useToast()
  const testConnectionMutation = trpc.resource.testConnection.useMutation({
    onSuccess: (success) => {
      if (success) {
        toast({
          title: 'Success',
          description: 'Successfully connected to database',
        })
      }
    },
  })

  return (
    <Card className="max-w-screen-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          onReset={() => {
            form.reset()
          }}
        >
          <CardHeader>
            <CardTitle>Create Resource</CardTitle>
            <CardDescription>Enter database credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                disabled={config === 'fields'}
                name="url"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-2">
                      <div className="flex items-center space-x-4">
                        <FormLabel>URL</FormLabel>
                        <div className="flex-1" />
                        <FormField
                          name="config"
                          render={({ field }) => {
                            return (
                              <>
                                <Switch
                                  id="enable-form-config"
                                  checked={field.value === 'fields'}
                                  onCheckedChange={(value) => {
                                    field.onChange(value ? 'fields' : 'url')
                                    if (value) {
                                      form.resetField('url')
                                    } else {
                                      form.resetField('host')
                                      form.resetField('port')
                                      form.resetField('dbUsername')
                                      form.resetField('dbPassword')
                                      form.resetField('database')
                                    }
                                  }}
                                />
                                <Label>Enter fields</Label>
                              </>
                            )
                          }}
                        />
                      </div>
                      <FormControl>
                        <Input {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <div className="col-span-2 border-b" />
              <FormField
                control={form.control}
                disabled={config === 'url'}
                name="host"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                disabled={config === 'url'}
                name="port"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input type="number" className="font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                disabled={config === 'url'}
                name="dbUsername"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} name="dbUsername" className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                disabled={config === 'url'}
                name="dbPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" name="dbPassword" className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                disabled={config === 'url'}
                name="database"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Database</FormLabel>
                      <FormControl>
                        <Input {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button
              variant="outline"
              icon={<ZapIcon />}
              loading={testConnectionMutation.isLoading}
              onClick={() => {
                form.handleSubmit((values) => {
                  const url =
                    values.config === 'url'
                      ? values.url
                      : values.config === 'fields'
                      ? `postgresql://${encodeURIComponent(values.dbUsername)}:${encodeURIComponent(
                          values.dbPassword,
                        )}@${encodeURIComponent(values.host)}:${encodeURIComponent(values.port)}/${values.database}`
                      : undefined
                  if (url) {
                    testConnectionMutation.mutate({ url, type: 'postgres' })
                  }
                })()
              }}
            >
              Test Connection
            </Button>
            {testConnectionMutation.data ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CheckCircle2Icon className="h-4 w-4" />
                <div className="text-xs">Database connected successfully</div>
              </div>
            ) : null}
            <div className="flex-1" />
            <BaseButton variant="secondary" asChild size="sm">
              <Link href="/resources">Cancel</Link>
            </BaseButton>
            <Button size="sm" type="submit">
              Create
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
