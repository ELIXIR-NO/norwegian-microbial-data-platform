import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, Search, Info, Ghost } from 'lucide-react'

import { Label } from './ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
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
import { fetchOrganizations, fetchSpecies } from '@/lib/api/samples'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useQuery } from '@tanstack/react-query'
import { fetchTaxon } from '@/lib/api/samples'

const SPECIES_LIST = [
  'Escherichia coli',
  'Staphylococcus aureus',
  'Pseudomonas aeruginosa',
]

export function SearchData() {
  const [query, setQuery] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<number[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [speciesOptions, setSpeciesOptions] = useState<number[]>([])
  const [organizationOptions, setOrganizationOptions] = useState<string[]>([])

  useEffect(() => {
    let active = true

    Promise.all([fetchSpecies(), fetchOrganizations()])
      .then(([species, organizations]) => {
        if (!active) return

        setSpeciesOptions(species)
        setOrganizationOptions(organizations)
      })
      .catch((error) => {
        console.error('Failed to load search filters:', error)
      })

    return () => {
      active = false
    }
  }, [])

  const navigate = useNavigate()

  const toggleSpecies = (taxId: number) => {
    setSelectedSpecies((current) =>
      current.includes(taxId)
        ? current.filter((id) => id !== taxId)
        : [...current, taxId],
    )
  }

  const taxonQueries = useQuery({
    queryKey: ['taxa', speciesOptions],
    queryFn: async () =>
      Promise.all(speciesOptions.map((taxId) => fetchTaxon(taxId))),
    enabled: speciesOptions.length > 0,
  })

  const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    navigate({
      to: '/search',
      search: {
        query: query.trim() || undefined,
        species: selectedSpecies.map(String),
        organization: selectedOrganization || undefined,
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
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                className="inline-flex items-center gap-2 bg-elixir-blue text-secondary hover:bg-elixir-blue hover:text-secondary/70"
                variant="ghost"
              >
                Advanced Search Available
                <ChevronDown className="size-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="center"
              side="bottom"
              sideOffset={8}
              className="min-w-5xl space-y-5 p-5"
            >
              <div className="space-y-1">
                <h2 className="font-semibold">Advanced Search</h2>

                <p className="text-sm text-muted-foreground">
                  Filter datasets by species.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Species (Tax ID)</Label>

                {taxonQueries.isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading species...
                  </p>
                )}

                {taxonQueries.isError && (
                  <p className="text-sm text-destructive">
                    Failed to load species names.
                  </p>
                )}

                {taxonQueries.data?.map((taxon) => {
                  const taxId = Number(taxon.tax_id)

                  return (
                    <div key={taxon.tax_id} className="flex items-center gap-2">
                      <Checkbox
                        id={`species-${taxId}`}
                        checked={selectedSpecies.includes(taxId)}
                        onCheckedChange={() => toggleSpecies(taxId)}
                      />

                      <Label
                        htmlFor={`species-${taxId}`}
                        className="cursor-pointer font-normal"
                      >
                        {taxon.name} (Tax ID: {taxon.tax_id})
                      </Label>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Data owner / Organization
                </Label>

                <Select
                  value={selectedOrganization || 'all'}
                  onValueChange={(value) =>
                    setSelectedOrganization(value === 'all' ? '' : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All organizations</SelectItem>

                    {organizationOptions.map((organization) => (
                      <SelectItem key={organization} value={organization}>
                        {organization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  className="bg-elixir-blue text-secondary hover:bg-elixir-blue/90 hover:text-secondary"
                  onClick={() => {
                    setSelectedSpecies([])
                    setSelectedOrganization('')
                  }}
                >
                  Clear filters
                </Button>

                <Button
                  className="bg-elixir-blue text-secondary hover:bg-elixir-blue/90 hover:text-secondary"
                  onClick={() => handleSearch()}
                >
                  Apply filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  )
}
