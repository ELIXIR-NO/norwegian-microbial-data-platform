import { ChevronDownIcon, Search } from 'lucide-react'
import { BsInfoCircleFill } from 'react-icons/bs'
import { Input } from './ui/input'
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

export function SearchData() {
  return (
    <div className="w-full max-w-[1400px] mx-6 flex gap-4">
      <div className="grow">
        <InputGroup className="h-16">
          <InputGroupAddon className="h-96">
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Discover pre-published metadata..." />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="default" className="h-10 w-16">
              Search
            </InputGroupButton>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <InputGroupButton variant="ghost" className="!pr-1.5 text-sm">
                  Advanced search... <ChevronDownIcon className="size-4" />
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-[1350px] p-6 -mx-2 my-6"
                side="bottom"
                align="end"
              >
                <h4 className="font-semibold mb-4">Advanced Search</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="gap-6">
                    <Label htmlFor="species" className="mb-2">
                      Species
                    </Label>
                    <Input id="species" placeholder="Enter species..." />
                  </div>
                  <div>
                    <Label htmlFor="date" className="mb-2">
                      Date of submission
                    </Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="host" className="mb-2">
                      Host species/environment
                    </Label>
                    <Input id="host" placeholder="Enter host/environment..." />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="content-center flex-none">
        <Tooltip>
          <TooltipTrigger asChild>
            <BsInfoCircleFill size={36} color="#1f283a" />
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-primary [&_svg]:hidden!">
            <h1 className="font-bold">Discover pre-published metadata</h1>
            <p>
              Part of the contextual metadata for all data sets in NMDP is
              <br />
              exposed. This enable the discoverability of published and
              unpublished data.
              <br />
              <br />
              NMDP exposes the following metadata fields:
              <br />
              <ul className="text-justify leading-relaxed list-disc pl-6">
                <li>Species information</li>
                <li>Date of submission</li>
                <li>Number of samples</li>
                <li>Host species or environment</li>
                <li>Data owner</li>
              </ul>
              <br />
              <p>
                If you discover data sets of interest, ELIXIR will establish
                communication with data owner for access
              </p>
            </p>
            <p></p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
