import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: z.object({
    query: z.string().optional(),
    species: z.array(z.string()).optional(),
    date: z.string().optional(),
    host: z.string().optional(),
  }),
})

/* ---------------- TYPES ---------------- */

interface SearchResult {
  scientificName: string
  hostScientificName: string
  collectionDate: string
  isolationSource: string
  dataOwner: string
  numberOfSamples: number
  status: 'Published' | 'Unpublished' | 'Restricted'
}

/* ---------------- MOCK DATA ---------------- */

const mockResults: SearchResult[] = [
  {
    scientificName: 'Escherichia coli',
    hostScientificName: 'Homo sapiens',
    collectionDate: '2025-11-10',
    isolationSource: 'Blood',
    dataOwner: 'UNN',
    numberOfSamples: 120,
    status: 'Published',
  },
  {
    scientificName: 'Escherichia coli',
    hostScientificName: 'Homos sapiens',
    collectionDate: '2024-08-03',
    isolationSource: 'Blood',
    dataOwner: 'UNN',
    numberOfSamples: 54,
    status: 'Unpublished',
  },
  {
    scientificName: 'Escherichia coli',
    hostScientificName: 'Canis lupus familiaris',
    collectionDate: '2023-02-18',
    isolationSource: 'Urin',
    dataOwner: 'VI',
    numberOfSamples: 32,
    status: 'Restricted',
  },
]

const scientificNames = [
  'Escherichia coli',
  'Staphylococcus aureus',
  'Klebsiella pneumoniae',
]

const hostScientificNames = ['Homo sapiens', 'Canis lupus familiaris']

const collectionYears = ['2025', '2024', '2023']

const isolationSources = ['Blood', 'Urine', 'Respiratory tract']

const dataOwners = ['UNN', 'VI', 'FHI']

const sequencingTechnologies = [
  'Illumina NovaSeq',
  'Illumina MiSeq',
  'Oxford Nanopore',
]

function SearchSidebar() {
  const navigate = useNavigate({ from: '/search' })
  const search = Route.useSearch()

  function updateSearch(key: string, value?: string) {
    navigate({
      search: {
        ...search,
        [key]: value || undefined,
      },
    })
  }

  return (
    <Card className="w-72 shrink-0">
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-10rem)] pr-4 space-y-4">
          {/* Scientific name */}
          <FilterSelect
            label="Scientific name"
            value={search.species?.[0]}
            options={scientificNames}
            onChange={(v) => updateSearch('species', v)}
          />

          {/* Host scientific name */}
          <FilterSelect
            label="Host scientific name"
            value={search.host}
            options={hostScientificNames}
            onChange={(v) => updateSearch('host', v)}
          />

          {/* Collection year */}
          <FilterSelect
            label="Collection year"
            value={search.date}
            options={collectionYears}
            onChange={(v) => updateSearch('date', v)}
          />

          {/* Isolation source */}
          <FilterSelect
            label="Isolation source"
            options={isolationSources}
            onChange={(v) => updateSearch('isolationSource', v)}
          />

          {/* Data owner */}
          <FilterSelect
            label="Data owner (Institute)"
            options={dataOwners}
            onChange={(v) => updateSearch('dataOwner', v)}
          />

          {/* Sequencing technology */}
          <FilterSelect
            label="Sequencing technology"
            options={sequencingTechnologies}
            onChange={(v) => updateSearch('instrument', v)}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value?: string
  options: string[]
  onChange: (value?: string) => void
}) {
  return (
    <div className="space-y-4 py-2">
      <label className="text-sm font-medium">{label}</label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-55">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/* ---------------- COMPONENT ---------------- */

function RouteComponent() {
  return (
    <div className="p-6 py-25">
      <div className="flex gap-6 items-start">
        {/* Sidebar (fixa) */}
        <div className="shrink-0">
          <SearchSidebar />
        </div>

        {/* Table container */}
        <div className="flex-1 overflow-x-auto rounded-md border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Scientific name</th>
                <th className="px-4 py-2 text-left">Host scientific name</th>
                <th className="px-4 py-2 text-left">Collection date</th>
                <th className="px-4 py-2 text-left">Isolation source</th>
                <th className="px-4 py-2 text-left">Data owner</th>
                <th className="px-4 py-2 text-right">No. of samples</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {mockResults.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-muted/50 transition">
                  <td className="px-4 py-2 font-medium">
                    {row.scientificName}
                  </td>
                  <td className="px-4 py-2">{row.hostScientificName}</td>
                  <td className="px-4 py-2">{row.collectionDate}</td>
                  <td className="px-4 py-2">{row.isolationSource}</td>
                  <td className="px-4 py-2">{row.dataOwner}</td>
                  <td className="px-4 py-2 text-right">
                    {row.numberOfSamples}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: { status: SearchResult['status'] }) {
  const colors: Record<string, string> = {
    Published: 'bg-green-100 text-green-800',
    Unpublished: 'bg-yellow-100 text-yellow-800',
    Restricted: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  )
}
