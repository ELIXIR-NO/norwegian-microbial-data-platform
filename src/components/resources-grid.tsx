import { Separator } from './ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type ResourcesGridData = {
  title: string
  image: string
  link: string
}

export default function ResourcesGrid({
  data,
  className = '',
}: {
  data: Array<ResourcesGridData>
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-[1600px] mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mx-6',
        className,
      )}
    >
      {data.map((item) => (
        <Card
          key={item.title}
          className="flex h-full flex-col transition-shadow duration-300 hover:shadow-2xl"
        >
          <a
            href={item.link}
            className="flex h-full flex-col gap-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardHeader>
              <CardTitle className="text-lg text-center">
                {item.title}
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <Separator className="h-2px" />
            <CardContent className="flex flex-col justify-center space-y-6 text-center">
              <div className="w-full h-40 overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-scale-down"
                />
              </div>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  )
}
