import { createFileRoute } from '@tanstack/react-router'
import type { CardGridData } from '@/components/card-grid'
import type { ResourcesGridData } from '@/components/resources-grid'
import CardGrid from '@/components/card-grid'
import ResourcesGrid from '@/components/resources-grid'
import { SearchData } from '@/components/search-data'
import QuickStart from '@/components/quick-start'

export const Route = createFileRoute('/')({
  component: App,
})

const organism: Array<CardGridData> = [
  {
    title: 'Bacteria',
    description: '',
    link: '/',
    image: '/bacteria.jpg',
  },
  {
    title: 'Virus',
    description: '',
    link: '/',
    image: '/virus.jpg',
  },
  {
    title: 'Eukaryote',
    description: '',
    link: '/',
    image: 'eukaryote.jpg',
  },
  {
    title: 'Other',
    description: '',
    link: '/',
    image: 'microscope.jpg',
  },
]

const resources: Array<ResourcesGridData> = [
  {
    title: 'DATA MANAGEMENT PLAN',
    link: 'https://elixir.no/services/dsw',
    image: '/dsw.png',
  },
  {
    title: 'METADATA MANAGEMENT',
    link: 'https://www.metatrack.no',
    image: '/metatrack-logo.svg',
  },
  {
    title: 'DATA STORAGE',
    link: 'https://nels.elixir.no/nels-web',
    image: 'nels.png',
  },
  {
    title: 'PATHOGENS PORTAL',
    link: 'https://www.pathogens.no',
    image: 'pathogens_logo-white.png',
  },
  {
    title: 'DATA ANALYSIS',
    link: 'https://usegalaxy.org',
    image: 'galaxy.png',
  },
]

function App() {
  return (
    <div className="flex flex-col items-center">
      <section className="relative flex h-100 w-full items-center justify-center overflow-hidden">
        <div className="bg-elixir-blue absolute inset-0" />

        {/* Estrutura em coluna */}
        <div className="z-10 flex h-full w-full flex-col justify-between px-6 py-6">
          {/* Texto centralizado no meio da div */}
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="animate-fade-in mb-4 text-4xl font-bold text-white lg:text-6xl">
              Manage, Share and Archive Microbial Data
            </h1>
            <h4 className="animate-fade-in text-lg text-gray-200 lg:text-2xl">
              Simplifying metadata management, sample tracking and FAIR data
              sharing.
            </h4>
          </div>

          <div className="flex justify-center">
            <QuickStart />
          </div>
        </div>
      </section>

      <SearchData />

      <div className="flex flex-col items-center space-y-8 pt-8">
        <CardGrid data={organism} />
        <ResourcesGrid data={resources} />
      </div>
    </div>
  )
}

export default App
