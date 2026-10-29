import type { Sample } from '@/lib/api/samples'
import type { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Sample, unknown>[] = [
  {
    accessorKey: 'scientificName',
    header: 'Scientific name',
    cell: ({ row }) => (
      <span className="italic">{row.original.scientificName ?? '—'}</span>
    ),
  },
  {
    accessorKey: 'taxId',
    header: 'Tax ID',
    cell: ({ row }) => row.original.taxId ?? '—',
  },
  {
    accessorKey: 'hostScientificName',
    header: 'Host scientific name',
    cell: ({ row }) => row.original.hostScientificName ?? '—',
  },
  {
    accessorKey: 'hostTaxId',
    header: 'Host Tax ID',
    cell: ({ row }) => row.original.hostTaxId ?? '—',
  },
  {
    accessorKey: 'collectionYear',
    header: 'Collection year',
    cell: ({ row }) => row.original.collectionYear ?? '—',
  },
  {
    accessorKey: 'isolationSource',
    header: 'Isolation source',
    cell: ({ row }) => row.original.isolationSource ?? '—',
  },
  {
    accessorKey: 'dataOwningOrganization',
    header: 'Data owner',
    cell: ({ row }) => row.original.dataOwningOrganization ?? '—',
  },
]
