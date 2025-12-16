import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: About,
})

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'
import What from './what'
import Behind from './behind'
import Funding from './funding'
import Who from './who'
import Why from './why'

export default function About() {
  return (
    <>
      <Suspense>
        <Tabs defaultValue="what" className="py-25">
          <TabsList variant="underline">
            <TabsTrigger
              value="what"
              variant="underline"
              className="text-lg font-semibold text-gray-500 hover:text-foreground"
            >
              What is NMDP
            </TabsTrigger>
            <TabsTrigger
              value="people"
              variant="underline"
              className="text-lg font-semibold text-gray-500 hover:text-foreground"
            >
              Why NMDP
            </TabsTrigger>
            <TabsTrigger
              value="partners"
              variant="underline"
              className="text-lg font-semibold text-gray-500 hover:text-foreground"
            >
              Who is NMDP for
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              variant="underline"
              className="text-lg font-semibold text-gray-500 hover:text-foreground"
            >
              Behind NMDP
            </TabsTrigger>
            <TabsTrigger
              value="contact-us"
              variant="underline"
              className="text-lg font-semibold text-gray-500 hover:text-foreground"
            >
              Funding NMDP
            </TabsTrigger>
          </TabsList>
          <TabsContent value="what">
            <What />
          </TabsContent>
          <TabsContent value="people">
            <Why />
          </TabsContent>
          <TabsContent value="partners">
            <Who />
          </TabsContent>
          <TabsContent value="projects">
            <Behind />
          </TabsContent>
          <TabsContent value="contact-us">
            <Funding />
          </TabsContent>
        </Tabs>
      </Suspense>
    </>
  )
}
