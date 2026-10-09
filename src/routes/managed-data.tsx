import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/managed-data')({
  component: ManagedData,
})

function ManagedData() {
  return (
    <div className="flex min-h-[calc(75vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg transition-shadow duration-300 hover:shadow-xl">
        <CardContent className="">
          <a
            href="https://www.metatrack.no/login"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center rounded-md text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30 p-6">
              <img
                src="/metatrack-logo.svg"
                alt="Metatrack logo"
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h2 className="text-4xl font-semibold text-primary underline-offset-4 group-hover:underline">
              Manage your data in Metatrack
            </h2>
          </a>

          <CardHeader className="px-0 pb-0 pt-6">
            <CardTitle className="text-lg"></CardTitle>

            <CardDescription className="text-lg text-center leading-relaxed">
              You will be redirected to the Norwegian Microbial Data Platform
              <strong> metadata management system</strong>.
              <br />
              <br />
              This will require you to log in via FEIDE or{' '}
              <a
                href="https://nels-docs.readthedocs.io/en/latest/about.html#i-dont-have-feide-login-credentials"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about logging in without FEIDE credentials"
                title="Learn more about NeLS login"
                className="inline-flex text-blue-500 hover:text-primary/70"
              >
                NeLS idp
              </a>
              .
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  )
}
