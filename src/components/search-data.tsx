import { ChevronDownIcon, Search } from 'lucide-react'
import { BsInfoCircleFill } from 'react-icons/bs'
import { useState } from 'react'
import { Label } from './ui/label'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useNavigate } from '@tanstack/react-router'

const SPECIES_LIST = [
  'Escherichia coli',
  'Staphylococcus aureus',
  'Pseudomonas aeruginosa',
]

export function SearchData() {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])
  const toggleSpecies = (species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species],
    )
  }
  const [query, setQuery] = useState('')

  const navigate = useNavigate()

  const handleSearch = () => {
    navigate({
      to: '/search',
      search: {
        query,
        species: selectedSpecies,
      },
    })
  }

  return (
    <div className="w-full max-w-[1400px] mx-6 flex gap-4">
      <div className="grow">
        <InputGroup className="h-16">
          <InputGroupAddon className="h-96">
            <Search />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Discover pre-published metadata..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="default"
              className="h-10 w-16"
              onClick={handleSearch}
            >
              Search
            </InputGroupButton>

            <Popover modal>
              <PopoverTrigger asChild>
                <InputGroupButton variant="ghost" className="!pr-1.5 text-sm">
                  Advanced search...
                  <ChevronDownIcon className="ml-1 size-4" />
                </InputGroupButton>
              </PopoverTrigger>

              <PopoverContent
                className="w-[1350px] p-6 -mx-2 my-6"
                side="bottom"
                align="end"
              >
                <h4 className="mb-4 font-semibold">Advanced Search</h4>

                <div className="grid grid-cols-1 gap-6">
                  {/* Species */}
                  <div>
                    <Label className="mb-2 block">Species</Label>

                    <div className="space-y-2">
                      {SPECIES_LIST.map((species) => (
                        <div key={species} className="flex items-center gap-2">
                          <Checkbox
                            id={species}
                            checked={selectedSpecies.includes(species)}
                            onCheckedChange={() => toggleSpecies(species)}
                          />
                          <Label htmlFor={species}>{species}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Tooltip */}
      <div className="content-center flex-none">
        <Tooltip>
          <TooltipTrigger asChild>
            <BsInfoCircleFill size={36} color="#1f283a" />
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-primary [&_svg]:hidden!">
            <h1 className="font-bold">Discover pre-published metadata</h1>
            <p className="leading-relaxed">
              Part of the contextual metadata for all data sets in NMDP is
              exposed.
              <br />
              <br />
              NMDP exposes:
              <ul className="list-disc pl-6">
                <li>Species information</li>
                <li>Date of submission</li>
                <li>Number of samples</li>
                <li>Host species or environment</li>
                <li>Data owner</li>
              </ul>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
