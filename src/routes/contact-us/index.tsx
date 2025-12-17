import { createFileRoute } from '@tanstack/react-router'
import ContactUsForm from './contact-us-form'

export const Route = createFileRoute('/contact-us/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-6 flex flex-col gap-7 items-center py-25">
      <div className="text-medium text-justify font-normal w-3/4">
        We are happy for any input and suggestions for relevant content that you
        think should be mentioned in the{' '}
        <strong>Norwegian Microbial Data Platform</strong>. Contact us at{' '}
        <a
          className="visited:text-destructive text-blue-600"
          href="mailto:support@elixir.no"
        >
          support@elixir.no
        </a>{' '}
        or use the contact form below.
      </div>
      <div className="w-3/4">
        <ContactUsForm />
      </div>
    </div>
  )
}
