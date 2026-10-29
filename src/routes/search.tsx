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

const UNKNOWN_SPECIES = '__unknown_species__'
const UNKNOWN_ORGANIZATION = '__unknown_organization__'
const UNKNOWN_HOST = '__unknown_host__'
const UNKNOWN_YEAR = '__unknown_year__'
const UNKNOWN_ISOLATION_SOURCE = '__unknown_isolation_source__'
const EMPTY_FILTER_VALUES: string[] = []

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: z.object({
    query: z.string().optional(),
    species: z.array(z.string()).optional(),
    organization: z.string().optional(),
    host: z.array(z.string()).optional(),
    collectionYear: z.array(z.string()).optional(),
    isolationSource: z.array(z.string()).optional(),
  }),
})

type FilterKey =
  | 'species'
  | 'organization'
  | 'host'
  | 'collectionYear'
  | 'isolationSource'

type PublicSample = Awaited<ReturnType<typeof fetchAllSamples>>[number]

type SearchFilters = {
  query?: string
  species: string[]
  organization?: string
  host: string[]
  collectionYear: string[]
  isolationSource: string[]
}

function matchesSampleFilters(
  sample: PublicSample,
  filters: SearchFilters,
  excludedFilter?: FilterKey,
) {
  const query = filters.query?.trim().toLowerCase()
  const scientificName = (
    sample.scientificName?.trim() || 'Unknown species'
  ).toLowerCase()
  const dataOwner = (
    sample.dataOwningOrganization?.trim() || 'Unknown organization'
  ).toLowerCase()
  const sampleId = (sample.id ?? '').toLowerCase()
  const taxId = String(sample.taxId ?? '')
  const hostScientificName = (
    sample.hostScientificName?.trim() || 'Unknown host'
  ).toLowerCase()
  const hostTaxId = String(sample.hostTaxId ?? '')
  const collectionYear =
    sample.collectionYear == null
      ? 'Unknown year'
      : String(sample.collectionYear)
  const isolationSource = (
    sample.isolationSource?.trim() || 'Unknown isolation source'
  ).toLowerCase()

  const matchesQuery =
    !query ||
    scientificName.includes(query) ||
    dataOwner.includes(query) ||
    sampleId.includes(query) ||
    taxId.includes(query) ||
    hostScientificName.includes(query) ||
    hostTaxId.includes(query) ||
    collectionYear.toLowerCase().includes(query) ||
    isolationSource.includes(query) ||
    (['unknown', 'ukn'].includes(query) &&
      (!sample.scientificName?.trim() ||
        !sample.dataOwningOrganization?.trim() ||
        !sample.hostScientificName?.trim() ||
        sample.collectionYear == null ||
        !sample.isolationSource?.trim()))

  const matchesSpecies =
    excludedFilter === 'species' ||
    filters.species.length === 0 ||
    (filters.species.includes(UNKNOWN_SPECIES) &&
      !sample.scientificName?.trim()) ||
    (Boolean(sample.scientificName?.trim()) &&
      filters.species
        .filter((value) => value !== UNKNOWN_SPECIES)
        .map(Number)
        .filter(Number.isFinite)
        .includes(sample.taxId))

  const matchesOrganization =
    excludedFilter === 'organization' ||
    !filters.organization ||
    (filters.organization === UNKNOWN_ORGANIZATION
      ? !sample.dataOwningOrganization?.trim()
      : sample.dataOwningOrganization === filters.organization)

  const hostValue = sample.hostScientificName?.trim()
  const matchesHost =
    excludedFilter === 'host' ||
    filters.host.length === 0 ||
    (filters.host.includes(UNKNOWN_HOST) && !hostValue) ||
    (typeof hostValue === 'string' && filters.host.includes(hostValue))

  const yearValue =
    sample.collectionYear == null ? UNKNOWN_YEAR : String(sample.collectionYear)
  const matchesYear =
    excludedFilter === 'collectionYear' ||
    filters.collectionYear.length === 0 ||
    filters.collectionYear.includes(yearValue)

  const sourceValue = sample.isolationSource?.trim()
  const matchesIsolationSource =
    excludedFilter === 'isolationSource' ||
    filters.isolationSource.length === 0 ||
    (filters.isolationSource.includes(UNKNOWN_ISOLATION_SOURCE) &&
      !sourceValue) ||
    (typeof sourceValue === 'string' &&
      filters.isolationSource.includes(sourceValue))

  return (
    matchesQuery &&
    matchesSpecies &&
    matchesOrganization &&
    matchesHost &&
    matchesYear &&
    matchesIsolationSource
  )
}

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

  const selectedSpecies = search.species ?? EMPTY_FILTER_VALUES
  const selectedHosts = search.host ?? EMPTY_FILTER_VALUES
  const selectedYears = search.collectionYear ?? EMPTY_FILTER_VALUES
  const selectedSources = search.isolationSource ?? EMPTY_FILTER_VALUES

  const currentFilters = useMemo<SearchFilters>(
    () => ({
      query: search.query,
      species: selectedSpecies,
      organization: search.organization,
      host: selectedHosts,
      collectionYear: selectedYears,
      isolationSource: selectedSources,
    }),
    [
      search.query,
      search.organization,
      selectedSpecies,
      selectedHosts,
      selectedYears,
      selectedSources,
    ],
  )

  // Each facet counts samples matching every active filter except its own.
  // Keep selected options visible even if their count becomes zero.
  const speciesOptions = useMemo(() => {
    const allOptions = new Map<
      string,
      { value: string; taxId: number | null; name: string }
    >()
    const counts = new Map<string, number>()
    const facetSamples = samples.filter((sample) =>
      matchesSampleFilters(sample, currentFilters, 'species'),
    )

    for (const sample of samples) {
      const hasName = Boolean(sample.scientificName?.trim())
      const value = hasName ? String(sample.taxId) : UNKNOWN_SPECIES
      if (!allOptions.has(value)) {
        allOptions.set(value, {
          value,
          taxId: hasName ? (sample.taxId ?? null) : null,
          name: hasName ? sample.scientificName!.trim() : 'Unknown species',
        })
      }
    }

    for (const sample of facetSamples) {
      const value = sample.scientificName?.trim()
        ? String(sample.taxId)
        : UNKNOWN_SPECIES
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }

    return Array.from(allOptions.values())
      .map((option) => ({ ...option, count: counts.get(option.value) ?? 0 }))
      .filter(
        (option) => option.count > 0 || selectedSpecies.includes(option.value),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [samples, currentFilters, selectedSpecies])

  const organizationOptions = useMemo(() => {
    const allOptions = new Set<string>()
    const counts = new Map<string, number>()
    const facetSamples = samples.filter((sample) =>
      matchesSampleFilters(sample, currentFilters, 'organization'),
    )

    for (const sample of samples) {
      allOptions.add(
        sample.dataOwningOrganization?.trim()
          ? sample.dataOwningOrganization
          : UNKNOWN_ORGANIZATION,
      )
    }

    for (const sample of facetSamples) {
      const value = sample.dataOwningOrganization?.trim()
        ? sample.dataOwningOrganization
        : UNKNOWN_ORGANIZATION
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }

    return Array.from(allOptions)
      .map((value) => ({
        value,
        name: value === UNKNOWN_ORGANIZATION ? 'Unknown organization' : value,
        count: counts.get(value) ?? 0,
      }))
      .filter(
        (option) => option.count > 0 || option.value === search.organization,
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [samples, currentFilters, search.organization])

  const hostOptions = useMemo(() => {
    const allOptions = new Set<string>()
    const counts = new Map<string, number>()
    const facetSamples = samples.filter((sample) =>
      matchesSampleFilters(sample, currentFilters, 'host'),
    )

    for (const sample of samples) {
      allOptions.add(sample.hostScientificName?.trim() || UNKNOWN_HOST)
    }

    for (const sample of facetSamples) {
      const value = sample.hostScientificName?.trim() || UNKNOWN_HOST
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }

    return Array.from(allOptions)
      .map((value) => ({
        value,
        name: value === UNKNOWN_HOST ? 'Unknown host' : value,
        count: counts.get(value) ?? 0,
      }))
      .filter(
        (option) => option.count > 0 || selectedHosts.includes(option.value),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [samples, currentFilters, selectedHosts])

  const collectionYearOptions = useMemo(() => {
    const allOptions = new Set<string>()
    const counts = new Map<string, number>()
    const facetSamples = samples.filter((sample) =>
      matchesSampleFilters(sample, currentFilters, 'collectionYear'),
    )

    for (const sample of samples) {
      allOptions.add(
        sample.collectionYear == null
          ? UNKNOWN_YEAR
          : String(sample.collectionYear),
      )
    }

    for (const sample of facetSamples) {
      const value =
        sample.collectionYear == null
          ? UNKNOWN_YEAR
          : String(sample.collectionYear)
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }

    return Array.from(allOptions)
      .map((value) => ({
        value,
        name: value === UNKNOWN_YEAR ? 'Unknown year' : value,
        count: counts.get(value) ?? 0,
      }))
      .filter(
        (option) => option.count > 0 || selectedYears.includes(option.value),
      )
      .sort((a, b) => {
        if (a.value === UNKNOWN_YEAR) return 1
        if (b.value === UNKNOWN_YEAR) return -1
        return Number(b.value) - Number(a.value)
      })
  }, [samples, currentFilters, selectedYears])

  const isolationSourceOptions = useMemo(() => {
    const allOptions = new Set<string>()
    const counts = new Map<string, number>()
    const facetSamples = samples.filter((sample) =>
      matchesSampleFilters(sample, currentFilters, 'isolationSource'),
    )

    for (const sample of samples) {
      allOptions.add(sample.isolationSource?.trim() || UNKNOWN_ISOLATION_SOURCE)
    }

    for (const sample of facetSamples) {
      const value = sample.isolationSource?.trim() || UNKNOWN_ISOLATION_SOURCE
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }

    return Array.from(allOptions)
      .map((value) => ({
        value,
        name:
          value === UNKNOWN_ISOLATION_SOURCE
            ? 'Unknown isolation source'
            : value,
        count: counts.get(value) ?? 0,
      }))
      .filter(
        (option) => option.count > 0 || selectedSources.includes(option.value),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [samples, currentFilters, selectedSources])

  const filteredSamples = useMemo(
    () =>
      samples.filter((sample) => matchesSampleFilters(sample, currentFilters)),
    [samples, currentFilters],
  )

  const activeSpecies = speciesOptions.filter((species) =>
    selectedSpecies.includes(species.value),
  )
  const activeHosts = hostOptions.filter((host) =>
    selectedHosts.includes(host.value),
  )
  const activeYears = collectionYearOptions.filter((year) =>
    selectedYears.includes(year.value),
  )
  const activeSources = isolationSourceOptions.filter((source) =>
    selectedSources.includes(source.value),
  )
  const activeOrganization = organizationOptions.find(
    (item) => item.value === search.organization,
  )

  const hasActiveFilters =
    Boolean(search.query?.trim()) ||
    selectedSpecies.length > 0 ||
    Boolean(search.organization) ||
    selectedHosts.length > 0 ||
    selectedYears.length > 0 ||
    selectedSources.length > 0

  function updateFilters(filters: {
    query?: string
    species?: string[]
    organization?: string
    host?: string[]
    collectionYear?: string[]
    isolationSource?: string[]
  }) {
    navigate({
      search: {
        query: filters.query,
        species: filters.species ?? [],
        organization: filters.organization,
        host: filters.host ?? [],
        collectionYear: filters.collectionYear ?? [],
        isolationSource: filters.isolationSource ?? [],
      },
    })
  }

  function toggleArrayFilter(
    key: 'species' | 'host' | 'collectionYear' | 'isolationSource',
    value: string,
    checked: boolean,
  ) {
    const current = search[key] ?? []
    const next = checked
      ? [...new Set([...current, value])]
      : current.filter((item) => item !== value)

    updateFilters({
      query: search.query,
      species: key === 'species' ? next : search.species,
      organization: search.organization,
      host: key === 'host' ? next : search.host,
      collectionYear: key === 'collectionYear' ? next : search.collectionYear,
      isolationSource:
        key === 'isolationSource' ? next : search.isolationSource,
    })
  }

  function selectOrganization(organization: string) {
    updateFilters({
      query: search.query,
      species: search.species,
      organization:
        search.organization === organization ? undefined : organization,
      host: search.host,
      collectionYear: search.collectionYear,
      isolationSource: search.isolationSource,
    })
  }

  function clearFilters() {
    setSearchInput('')
    updateFilters({
      query: undefined,
      species: [],
      organization: undefined,
      host: [],
      collectionYear: [],
      isolationSource: [],
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
                    updateFilters({
                      query: searchInput.trim() || undefined,
                      species: search.species,
                      organization: search.organization,
                      host: search.host,
                      collectionYear: search.collectionYear,
                      isolationSource: search.isolationSource,
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
                      className="border-white/30 bg-white pl-9 text-gray-900 placeholder:text-gray-500"
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
                                host: search.host,
                                collectionYear: search.collectionYear,
                                isolationSource: search.isolationSource,
                              })
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      )}

                      {activeSpecies.map((species) => (
                        <Badge
                          key={species.value}
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          <span className="break-words">
                            {species.name}
                            {species.taxId != null ? ` (${species.taxId})` : ''}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${species.name} filter`}
                            onClick={() =>
                              toggleArrayFilter('species', species.value, false)
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      ))}

                      {activeOrganization && (
                        <Badge
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          {activeOrganization.name}
                          <button
                            type="button"
                            aria-label="Remove organization filter"
                            onClick={() =>
                              selectOrganization(activeOrganization.value)
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      )}

                      {activeHosts.map((host) => (
                        <Badge
                          key={host.value}
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          {host.name}
                          <button
                            type="button"
                            aria-label={`Remove ${host.name} filter`}
                            onClick={() =>
                              toggleArrayFilter('host', host.value, false)
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      ))}

                      {activeYears.map((year) => (
                        <Badge
                          key={year.value}
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          {year.name}
                          <button
                            type="button"
                            aria-label={`Remove ${year.name} filter`}
                            onClick={() =>
                              toggleArrayFilter(
                                'collectionYear',
                                year.value,
                                false,
                              )
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      ))}

                      {activeSources.map((source) => (
                        <Badge
                          key={source.value}
                          variant="secondary"
                          className="max-w-full gap-1 py-1"
                        >
                          {source.name}
                          <button
                            type="button"
                            aria-label={`Remove ${source.name} filter`}
                            onClick={() =>
                              toggleArrayFilter(
                                'isolationSource',
                                source.value,
                                false,
                              )
                            }
                          >
                            <X className="size-3 shrink-0" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />
              </>
            )}

            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Species
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by scientific name
                </p>
                <div className="max-h-96 space-y-3 overflow-y-auto px-2">
                  {speciesOptions.map((species) => (
                    <div key={species.value} className="flex items-start gap-2">
                      <Checkbox
                        id={`species-${species.value}`}
                        className="mt-0.5"
                        checked={selectedSpecies.includes(species.value)}
                        onCheckedChange={(checked) =>
                          toggleArrayFilter(
                            'species',
                            species.value,
                            checked === true,
                          )
                        }
                      />
                      <Label
                        htmlFor={`species-${species.value}`}
                        className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-2 font-normal"
                      >
                        <span className="min-w-0 break-words">
                          <span className="italic">{species.name}</span>
                          {species.taxId != null && (
                            <span className="block text-xs text-muted-foreground">
                              Tax ID: {species.taxId}
                            </span>
                          )}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {species.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Host scientific name
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by host organism
                </p>
                <div className="max-h-64 space-y-3 overflow-y-auto px-2">
                  {hostOptions.map((host) => (
                    <div key={host.value} className="flex items-start gap-2">
                      <Checkbox
                        id={`host-${host.value}`}
                        className="mt-0.5"
                        checked={selectedHosts.includes(host.value)}
                        onCheckedChange={(checked) =>
                          toggleArrayFilter(
                            'host',
                            host.value,
                            checked === true,
                          )
                        }
                      />
                      <Label
                        htmlFor={`host-${host.value}`}
                        className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-2 font-normal"
                      >
                        <span className="min-w-0 break-words">
                          <span className="italic">{host.name}</span>
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {host.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Collection year
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by collection year
                </p>
                <div className="max-h-64 space-y-3 overflow-y-auto px-2">
                  {collectionYearOptions.map((year) => (
                    <div key={year.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`year-${year.value}`}
                        checked={selectedYears.includes(year.value)}
                        onCheckedChange={(checked) =>
                          toggleArrayFilter(
                            'collectionYear',
                            year.value,
                            checked === true,
                          )
                        }
                      />
                      <Label
                        htmlFor={`year-${year.value}`}
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 font-normal"
                      >
                        <span className="break-words">{year.name}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {year.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Isolation source
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by isolation source
                </p>
                <div className="max-h-64 space-y-3 overflow-y-auto px-2">
                  {isolationSourceOptions.map((source) => (
                    <div key={source.value} className="flex items-start gap-2">
                      <Checkbox
                        id={`source-${source.value}`}
                        className="mt-0.5"
                        checked={selectedSources.includes(source.value)}
                        onCheckedChange={(checked) =>
                          toggleArrayFilter(
                            'isolationSource',
                            source.value,
                            checked === true,
                          )
                        }
                      />
                      <Label
                        htmlFor={`source-${source.value}`}
                        className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-2 font-normal"
                      >
                        <span className="min-w-0 break-words">
                          {source.name}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {source.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel className="text-secondary">
                Data owner
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <p className="px-2 pb-3 text-xs text-muted-foreground">
                  Filter by organization
                </p>
                <div className="space-y-3 px-2">
                  {organizationOptions.map((organization) => (
                    <div
                      key={organization.value}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`organization-${organization.value}`}
                        checked={search.organization === organization.value}
                        onCheckedChange={() =>
                          selectOrganization(organization.value)
                        }
                      />
                      <Label
                        htmlFor={`organization-${organization.value}`}
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
