import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from './ui/button'
import type { FC } from 'react'
import { cn } from '@/lib/utils'

type NavItem = { pageUrl: string; pageName: string }
const NavItems: Array<NavItem> = [
  {
    pageUrl: '/managed-data',
    pageName: 'Managed Data',
  },
  {
    pageUrl: '/about',
    pageName: 'About',
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
    <nav className="flex w-full justify-between py-4">
      <div className="flex w-full justify-around">
        <div className="flex items-center gap-6">
          <a href="https://elixir.no">
            <img
              src={'/elixir-no-logo-black.svg'}
              alt={'Elixir Logo'}
              width={150}
              height={50}
            />
          </a>
          <Link to="/">
            <div className="flex flex-col justify-center">
              <h1 className="animate-fade-in text-4xl font-bold lg:text-2xl">
                Norwegian Microbial Data Platform
              </h1>
              <h4 className="animate-fade-in text-lg lg:text-base">
                Manage, share and archive data
              </h4>
            </div>
          </Link>
        </div>

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
  const pathName = useRouterState({
    select: (state) => state.location.pathname,
  })

  const isActive = pathName === pageUrl

  return (
    <Button
      asChild
      className={cn('text-md h-10 rounded-md px-4 has-[>svg]:px-4')}
      variant={isActive ? 'default' : 'secondary'}
    >
      <a href={pageUrl}>{pageName}</a>
    </Button>
  )
}
