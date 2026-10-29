const API_BASE_URL = 'https://api.metatrack.no/api/public/samples'

export interface Sample {
  id: string
  taxId: number
  scientificName: string
  dataOwningOrganization: string
  hostTaxId: number | null
  hostScientificName: string | null
  collectionYear: number | null
  isolationSource: string | null
}

export interface PaginatedSamples {
  items: Sample[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function fetchSamples(page = 0) {
  return fetchJson<PaginatedSamples>(`${API_BASE_URL}?page=${page}`)
}

export function fetchSpecies() {
  return fetchJson<number[]>(`${API_BASE_URL}/species`)
}

export function fetchOrganizations() {
  return fetchJson<string[]>(`${API_BASE_URL}/organizations`)
}

/**
 * Fetch all pages.
 *
 * Useful for the initial client-side search implementation.
 * For a much larger dataset, server-side filtering is preferable.
 */
export async function fetchAllSamples(): Promise<Sample[]> {
  const firstPage = await fetchSamples(0)

  if (firstPage.totalPages <= 1) {
    return firstPage.items
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      fetchSamples(index + 1),
    ),
  )

  return [...firstPage.items, ...remainingPages.flatMap((page) => page.items)]
}

export interface Taxon {
  name: string
  tax_id: string
}

export function fetchTaxon(taxId: number) {
  return fetchJson<Taxon>(`https://api.metatrack.no/taxon/${taxId}`)
}
