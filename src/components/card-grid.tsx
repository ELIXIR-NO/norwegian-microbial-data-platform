import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

export type CardGridData = {
  title: string
  description: string
  image: string
  link: string
}

export default function CardGrid({
  data,
  className = '',
}: {
  data: CardGridData[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-[1400px] mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mx-6',
        className,
      )}
    >
      {data.map((item) => (
        <Card
          key={item.title}
          className="flex h-full flex-col transition-shadow duration-300 hover:shadow-2xl"
        >
          <Link to="/" className="flex h-full flex-col">
            <CardContent className="flex flex-col justify-center space-y-6 text-center">
              <div className="w-full h-60 overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <p className="text-sm whitespace-break-spaces">
                {item.description}
              </p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
