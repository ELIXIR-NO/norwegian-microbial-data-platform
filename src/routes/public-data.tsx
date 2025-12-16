import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/public-data')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="py-25">Hello "/public-data"!</div>
}
