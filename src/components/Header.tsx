import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from './ui/button'
import type { FC } from 'react'
import { cn } from '@/lib/utils'

type NavItem = { pageUrl: string; pageName: string }
const NavItems: Array<NavItem> = [
  {
    pageUrl: '/about',
    pageName: 'About',
  },
  {
    pageUrl: '/account/login',
    pageName: 'Login/Register',
  },
  {
    pageUrl: '/public-data',
    pageName: 'Public Data',
  },
  {
    pageUrl: '/get-started',
    pageName: 'Get Started',
  },
  {
    pageUrl: '/contact-us',
    pageName: 'Contact Us',
  },
]

export function Header() {
  return (
    <nav className="fixed left-10 right-0 top-2 z-100 h-fit py-2 backdrop-blur-sm">
      <div className="flex w-screen grid grid-flow-col justify-items-center">
        <Link to="/" className="flex  gap-6 justify-self-start">
          <img
            src={'/elixir-no-logo-black.svg'}
            alt={'Elixir Logo'}
            width={90}
            height={45.55}
          />

          <div className="flex flex-col justify-center">
            <h1 className="animate-fade-in text-4xl font-bold lg:text-3xl">
              Norwegian Microbial Data Platform
            </h1>
            <h4 className="animate-fade-in text-lg lg:text-lg">
              Manage, share and archive data
            </h4>
          </div>
        </Link>

        <div className="flex flex-row items-center gap-x-4 pb-4 justify-self-center">
          <ul className="flex flex-row items-center gap-x-4">
            {NavItems.map((it) => (
              <NavBarItem
                key={it.pageName}
                pageUrl={it.pageUrl}
                pageName={it.pageName}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

const NavBarItem: FC<NavItem> = ({ pageUrl, pageName }) => {
  const selected = useRouterState({
    select: (state) => state.location.pathname,
  })
  const pathName = selected
  return (
    <Button
      asChild
      className={cn('text-md', 'h-10 rounded-md px-4 has-[>svg]:px-4')}
      variant={pathName === pageUrl ? 'default' : 'secondary'}
    >
      <a href={pageUrl}>{pageName}</a>
    </Button>
  )
}
