import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, Info, SquareArrowOutUpRight } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Button } from './ui/button'

export function SearchData() {
  const [query, setQuery] = useState('')

  const navigate = useNavigate()

  const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    navigate({
      to: '/search',
      search: {
        query: query.trim() || undefined,
      },
    })
  }

  return (
    <section className="mx-auto w-full   bg-elixir-blue px-4  text-white sm:px-6 lg:py-16">
      {/* Header */}
      <header className=" text-center mb-2 max-w-5xl mx-auto">
        <h3>Discover, manage and share Microbial Data</h3>

        <p className="mx-auto max-w-full text-base leading-relaxed ">
          A national platform for managing microbial datasets and metadata,
          enabling discovery, access and reuse.
        </p>
      </header>

      {/* Search area */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <form className="min-w-0 flex-1" onSubmit={handleSearch}>
            <InputGroup className="h-14 shadow-sm bg-secondary">
              <InputGroupAddon>
                <Search className="size-5 text-muted-foreground" />
              </InputGroupAddon>

              <InputGroupInput
                aria-label="Search metadata"
                placeholder="Search microbial datasets and metadata..."
                className="text-primary"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required
              />

              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  className="h-10 px-5 bg-elixir-blue text-secondary hover:bg-elixir-blue/90 hover:text-secondary"
                >
                  Search
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>

          {/* Search information */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Information about searchable metadata"
                className="shrink-0 rounded-full text-secondary transition-colors hover:text-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Info className="size-6" />
              </button>
            </TooltipTrigger>

            <TooltipContent
              side="right"
              className="max-w-xs [&_svg]:hidden p-4"
            >
              <div className="space-y-2">
                <p className="font-semibold text-base">
                  Discover pre-published metadata
                </p>

                <p className="leading-relaxed">
                  Part of the contextual metadata for datasets in NMDP is
                  exposed, including:
                </p>

                <ul className="list-disc space-y-1 pl-5">
                  <li>Species information</li>
                  <li>Date of submission</li>
                  <li>Number of samples</li>
                  <li>Host species or environment</li>
                  <li>Data owner</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Advanced Search */}
        <div className="flex justify-center">
          <Button
            className="inline-flex items-center gap-2 text-base"
            variant="secondary"
            onClick={() => navigate({ to: '/search' })}
          >
            Advanced Search
            <SquareArrowOutUpRight className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
