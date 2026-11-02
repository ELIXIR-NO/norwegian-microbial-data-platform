import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Footer from '@/components/Footer'
import { Header } from '@/components/Header'
import FeedbackButton from '@/components/feedBack-button'

function LayoutComponent() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  })

  const hideNavbar = pathname.startsWith('/search')

  return <>{!hideNavbar && <Header />}</>
}

export const Route = createRootRoute({
  component: () => (
    <>
      <LayoutComponent />
      <FeedbackButton />
      <Outlet />
      <Footer />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
