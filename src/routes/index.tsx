import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, CircleQuestionMark, FolderInput } from 'lucide-react'
import type { CardGridData } from '@/components/card-grid'
import type { ResourcesGridData } from '@/components/resources-grid'
import CardGrid from '@/components/card-grid'
import { QuickStartCard } from '@/components/quick-start'
import ResourcesGrid from '@/components/resources-grid'
import { SearchData } from '@/components/search-data'

export const Route = createFileRoute('/')({
  component: App,
})

const organism: Array<CardGridData> = [
  {
    title: 'Bacteria',
    description: '150 Samples\n 27 Species',
    link: '/',
    image: '/bacteria.jpg',
  },
  {
    title: 'Virus',
    description: '120 Samples\n 11 Species',
    link: '/',
    image: '/virus.jpg',
  },
  {
    title: 'Eukaryote',
    description: '1050 Sample\n 31 Species',
    link: '/',
    image: 'eukaryote.jpg',
  },
  {
    title: 'Other',
    description: '2240 Samples',
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
    link: 'https://norway.dsw.elixir-europe.org/wizard/',
    image: '/metatrack-logo.svg',
  },
  {
    title: 'DATA STORAGE',
    link: 'https://nels.bioinfo.no',
    image: 'nels.png',
  },
  {
    title: 'PATHOGENS PORTAL',
    link: 'https://www.pathogens.nos',
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
    <div className="flex flex-col items-center space-y-8 py-25">
      <section className="relative flex lg:h-80 sm:h-120 w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1f283a] dark:bg-black/40" />

        <div className="z-10 flex h-full w-full flex-col justify-between px-6 py-2">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="animate-fade-in mb-1 text-4xl font-bold text-white lg:text-3xl">
              Norwegian Microbial Data Plaform
            </h1>
            <h4 className="animate-fade-in text-lg text-gray-200 lg:text-lg">
              A secure, FAIR-aligned infrastructure for microbial data
            </h4>
          </div>
          <div className="mx-auto flex w-full max-w-[1400px] flex-wrap justify-center gap-[4vw] py-4">
            <QuickStartCard
              icon={<BookOpen size={30} className="text-white" />}
              title="Get Started"
              lines={[
                'Learn how to navigate the platform',
                'and start managing your metadata',
              ]}
            />

            <QuickStartCard
              icon={<FolderInput size={35} className="text-white" />}
              title="Manage in MetaTrack"
              lines={['Manage your metadata', 'systematically']}
            />

            <QuickStartCard
              icon={<CircleQuestionMark size={35} className="text-white" />}
              title="ELIXIR Support"
              lines={['Connect with', 'ELIXIR Norway support']}
            />
          </div>
        </div>
      </section>

      <SearchData />

      <CardGrid data={organism} />
      <ResourcesGrid data={resources} />
    </div>
  )
}

export default App
