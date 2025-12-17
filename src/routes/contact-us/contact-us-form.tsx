'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import contactUsFormSchema from './contactUsFormSchema'
import type { ContactUsFormSchema } from './contactUsFormSchema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { sendEmailToElixir } from './actions'

export default function ContactUsForm() {
  const form = useForm<ContactUsFormSchema>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async () => {
    // const serverResponse = await sendEmailToElixir(values)
    const serverResponse = { error: 'Error' }

    if (!serverResponse.error) {
      toast.success('Message sent successfully!', {
        description: 'We’ll get back to you soon.',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
      form.reset()
    } else {
      let errorMessage = 'An unexpected error occurred.'

      if (
        typeof serverResponse.error === 'object' &&
        serverResponse.error !== null &&
        'message' in serverResponse.error
      ) {
        errorMessage = String(
          (serverResponse.error as { message: string }).message,
        )
      } else {
        errorMessage = String(serverResponse.error)
      }

      toast.error('Message has not been sent', {
        description: errorMessage,
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID</FormLabel>
              <FormControl>
                <Input placeholder="jane.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormDescription>How can we help you?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sending...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
