import type { FC, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuickStartCardProps {
  icon: ReactNode
  title: string
  lines: string[]
}

export const QuickStartCard: FC<QuickStartCardProps> = ({
  icon,
  title,
  lines,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-6',
        'rounded-xl border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md',
        'transition duration-300 hover:bg-white/20',
        'w-[220px] sm:w-[240px] md:w-[260px] xl:w-[250px]',
        'h-[150px]',
      )}
    >
      <div className="flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
        {icon}

        <Button className="h-8 rounded-sm bg-white/20 px-4 text-white text-lg hover:bg-white/30 text-[16px]">
          {title}
        </Button>

        {lines.map((text, i) => (
          <p key={i} className="text-center leading-tight text-[14px]">
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}
