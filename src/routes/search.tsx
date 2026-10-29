import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { X, SlidersHorizontal, Search } from 'lucide-react'

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { fetchAllSamples } from '@/lib/api/samples'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table'
import { columns } from '@/routes/search/columns'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: z.object({
    query: z.string().optional(),
    species: z.array(z.string()).optional(),
    organization: z.string().optional(),
  }),
})

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })
  const [searchInput, setSearchInput] = useState(search.query ?? '')

  const {
    data: samples = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['public-samples'],
    queryFn: fetchAllSamples,
    staleTime: 60_000,
  })

  const speciesOptions = useMemo(() => {
    const speciesMap = new Map<
      number,
      { taxId: number; name: string; count: number }
    >()

    for (const sample of samples) {
      const existing = speciesMap.get(sample.taxId)

      if (existing) {
        existing.count++
      } else {
        speciesMap.set(sample.taxId, {
          taxId: sample.taxId,
          name: sample.scientificName ?? 'Unknown species',
          count: 1,
        })
      }
    }

    return Array.from(speciesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }, [samples])

  const organizationOptions = useMemo(() => {
    const organizationMap = new Map<string, number>()

    for (const sample of samples) {
      const organization =
        sample.dataOwningOrganization ?? 'Unknown organization'

      organizationMap.set(
        organization,
        (organizationMap.get(organization) ?? 0) + 1,
      )
    }

    return Array.from(organizationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [samples])

  const selectedTaxIds = (search.species ?? [])
    .map(Number)
    .filter(Number.isFinite)

  const filteredSamples = useMemo(() => {
    const query = search.query?.trim().toLowerCase()
    const organization = search.organization

    return samples.filter((sample) => {
      const scientificName = (sample.scientificName ?? '').toLowerCase()
      const dataOwner = (sample.dataOwningOrganization ?? '').toLowerCase()
      const sampleId = (sample.id ?? '').toLowerCase()
      const taxId = String(sample.taxId ?? '')

      const hostScientificName = (sample.hostScientificName ?? '').toLowerCase()
      const hostTaxId = String(sample.hostTaxId ?? '')
      const collectionYear = String(sample.collectionYear ?? '')
      const isolationSource = (sample.isolationSource ?? '').toLowerCase()

      const matchesQuery =
        !query ||
        scientificName.includes(query) ||
        dataOwner.includes(query) ||
        sampleId.includes(query) ||
        taxId.includes(query) ||
        hostScientificName.includes(query) ||
        hostTaxId.includes(query) ||
        collectionYear.includes(query) ||
        isolationSource.includes(query)

      const matchesSpecies =
        selectedTaxIds.length === 0 || selectedTaxIds.includes(sample.taxId)

      // Preserve the distinction between UiT and Uit.
      const matchesOrganization =
        !organization || sample.dataOwningOrganization === organization

      return matchesQuery && matchesSpecies && matchesOrganization
    })
  }, [samples, search.query, search.species, search.organization])

  const activeSpecies = speciesOptions.filter((species) =>
    selectedTaxIds.includes(species.taxId),
  )

  const hasActiveFilters =
    Boolean(search.query?.trim()) ||
    selectedTaxIds.length > 0 ||
    Boolean(search.organization)

  function updateFilters(filters: {
    query?: string
    species?: string[]
    organization?: string
  }) {
    navigate({
      search: {
        query: filters.query,
        species: filters.species ?? [],
        organization: filters.organization,
      },
    })
  }

  function toggleSpecies(taxId: number, checked: boolean) {
    const current = search.species ?? []

    const next = checked
      ? [...new Set([...current, String(taxId)])]
      : current.filter((id) => Number(id) !== taxId)

    updateFilters({
      query: search.query,
      species: next,
      organization: search.organization,
    })
  }

  function selectOrganization(organization: string) {
    updateFilters({
      query: search.query,
      species: search.species,
      organization:
        search.organization === organization ? undefined : organization,
    })
  }

  function clearFilters() {
    updateFilters({
      query: undefined,
      species: [],
      organization: undefined,
    })
  }

  if (isPending) {
    return <div className="p-8 text-muted-foreground">Loading samples...</div>
  }

  if (isError) {
    return (
      <div className="p-8 text-destructive">
        Failed to load samples: {error.message}
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <Sidebar
          collapsible="offcanvas"
          className="[&_[data-sidebar=sidebar]]:bg-elixir-blue [&_[data-sidebar=sidebar]]:text-white"
        >
          <SidebarHeader>
            <div className="px-2 py-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <SlidersHorizontal className="size-5" />
                Filters
              </h2>

              <p className="mt-1 text-sm text-white/70">
                {filteredSamples.length} of {samples.length} samples
              </p>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 px-2"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/80">
                Search
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()

                    navigate({
                      search: (previous) => ({
                        ...previous,
                        query: searchInput.trim() || undefined,
                      }),
                    })
                  }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search samples..."
                      className="border-white/30 bg-white text-gray-900 placeholder:text-gray-500 pl-9"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-elixir-orange text-elixir-blue hover:bg-elixir-orange/90"
                  >
                    Search
                  </Button>
                </form>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Active filters */}
            {hasActiveFilters && (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-secondary">
                    Active filters
                  </SidebarGroupLabel>

                  <SidebarGroupContent>
                    <div className="flex flex-wrap gap-2 px-1 py-1">
                      {search.query?.trim() && (
                        <Badge
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          <span className="break-all">
                            Search: {search.query}
                          </span>

                          <button
                            type="button"
                            aria-label="Remove text search"
                            onClick={() =>
                              updateFilters({
                                query: undefined,
                                species: search.species,
                                organization: search.organization,
                              })
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      )}

                      {activeSpecies.map((species) => (
                        <Badge
                          key={species.taxId}
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          <span className="break-words">
                            {species.name} ({species.taxId})
                          </span>

                          <button
                            type="button"
                            aria-label={`Remove ${species.name} filter`}
                            onClick={() => toggleSpecies(species.taxId, false)}
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      ))}

                      {search.organization && (
                        <Badge
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          {search.organization}

                          <button
                            type="button"
                            aria-label="Remove organization filter"
                            onClick={() =>
                              updateFilters({
                                query: search.query,
                                species: search.species,
                                organization: undefined,
                              })
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />
              </>
            )}

            {/* Species filters */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Species
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by scientific name
                </p>

                {speciesOptions.length === 0 ? (
                  <p className="px-2 text-sm text-muted-foreground">
                    No species available.
                  </p>
                ) : (
                  <div className="max-h-96 space-y-3 overflow-y-auto px-2">
                    {speciesOptions.map((species) => (
                      <div
                        key={species.taxId}
                        className="flex items-start gap-2"
                      >
                        <Checkbox
                          id={`species-${species.taxId}`}
                          className="mt-0.5"
                          checked={selectedTaxIds.includes(species.taxId)}
                          onCheckedChange={(checked) =>
                            toggleSpecies(species.taxId, checked === true)
                          }
                        />

                        <Label
                          htmlFor={`species-${species.taxId}`}
                          className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-2 font-normal"
                        >
                          <span className="min-w-0 break-words">
                            <span className="italic">{species.name}</span>

                            <span className="block text-xs text-muted-foreground">
                              Tax ID: {species.taxId}
                            </span>
                          </span>

                          <span className="text-xs tabular-nums text-muted-foreground">
                            {species.count}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Organization filters */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Data owner
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by organization
                </p>

                <div className="space-y-3 px-2">
                  {organizationOptions.map((organization, index) => (
                    <div
                      key={`${organization.name}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`organization-${index}`}
                        checked={search.organization === organization.name}
                        onCheckedChange={() =>
                          selectOrganization(organization.name)
                        }
                      />

                      <Label
                        htmlFor={`organization-${index}`}
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 font-normal"
                      >
                        <span className="break-words">{organization.name}</span>

                        <span className="text-xs tabular-nums text-muted-foreground">
                          {organization.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main results area */}
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
            <SidebarTrigger />

            <div className="min-w-0">
              <p className="font-semibold">Search Results</p>
              <p className="text-xs text-muted-foreground">
                Microbial data discovery
              </p>
            </div>
          </header>

          <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Microbial Samples</CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Browse the available public samples.
                  </p>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </CardHeader>

              <CardContent>
                {filteredSamples.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="font-medium">No samples found</p>

                    <p className="mt-1 text-sm">
                      Try removing some filters to see more results.
                    </p>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={clearFilters}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <DataTable columns={columns} data={filteredSamples} />
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
