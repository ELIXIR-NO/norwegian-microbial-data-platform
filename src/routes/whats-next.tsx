import { createFileRoute } from '@tanstack/react-router'
import { Code2, CalendarClock, Lightbulb, ArrowRight } from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/whats-next')({
  component: WhatsNextPage,
})

const roadmap = [
  {
    title: 'In Development',
    description: 'Features currently being developed and tested.',
    status: 'In progress',
    icon: Code2,
    className: 'size-6 text-green-600',
    features: [
      'Data brokering to ENA (A self service system for publishing data to ENA)',
      'Platform improvements and enhancements',
    ],
  },
  {
    title: 'Planned',
    description: 'Features planned for upcoming releases.',
    status: 'Planned',
    icon: CalendarClock,
    className: 'size-6 text-blue-600',
    features: [
      'Upcoming integrations with external services',
      'New tools for managing microbial data',
    ],
  },
  {
    title: 'Under Exploration',
    description: 'Ideas and opportunities being evaluated.',
    status: 'Exploring',
    icon: Lightbulb,
    className: 'size-6 text-yellow-600',
    features: [
      'Potential new platform capabilities',
      'Future collaborations and integrations',
    ],
  },
]

export function WhatsNextPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-6 py-12">
      <section className="max-w-3xl space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">What's Next</h1>
        <h2 className="text-xl text-muted-foreground">
          New features and services on the horizon
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          The Norwegian Microbial Data Platform (NMDP) is continuously evolving.
          Explore the features, integrations and services currently under
          development and planned for future releases.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {roadmap.map((stage) => {
          const Icon = stage.icon

          return (
            <Card
              key={stage.title}
              className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                  <Icon className={stage.className} />
                </div>

                <div className="space-y-4">
                  <Badge variant="secondary">{stage.status}</Badge>
                  <CardTitle>{stage.title}</CardTitle>
                  <CardDescription>{stage.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {stage.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </main>
  )
}
