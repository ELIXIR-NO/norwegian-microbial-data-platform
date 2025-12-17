import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CheckItemProps {
  title?: string
  description?: string
}

const checkItems: Array<CheckItemProps> = [
  {
    title: 'Secure data storage',
    description:
      'Compliant with Norwegian and European regulations for handling sensitive and non-sensitive microbiological data.',
  },
  {
    title: 'Rich metadata management',
    description:
      'Tools to capture essential contextual information about samples, studies, and sequencing data.',
  },
  {
    title: 'Federated discovery',
    description:
      'Users can find and explore relevant datasets without exposing the data itself, enabling collaboration and early discovery.',
  },
  {
    title: 'Integration with national and European infrastructures',
    description:
      'Tools to capture essential contextual information about samples, studies, and sequencing data.',
  },
  {
    title: 'User-friendly interface',
    description:
      'Designed for both expert bioinformaticians and applied researchers, with guided upload, annotation, and sharing workflows.',
  },
  {
    title: 'Long-term archiving and sustainability',
    description:
      'Hosted on national e-infrastructures (e.g. NIRD) to ensure persistent access and reliable data stewardship.',
  },
]

export default function What() {
  return (
    <>
      <h4 className="max-w-6xl text-justify leading-relaxed lg:mx-auto lg:py-4 text-xl">
        The <strong>Norwegian Microbial Data Platform (NMDP)</strong> is a
        national initiative that provides a secure, user-friendly infrastructure
        for
        <strong>
          storing, sharing, and archiving FAIR pathogen and infectious disease
          data
        </strong>{' '}
        Its goal is to accelerate{' '}
        <strong>research, innovation, and preparedness</strong> by making
        high-quality microbial data easier to find, access, and reuse — while
        ensuring that confidential information remains protected.
      </h4>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h3 className="mb-4 text-center font-semibold text-xl">
          What NMDP Offers
        </h3>

        <div className="grid grid-cols-3 gap-4 bg-gray-100 p-2">
          {checkItems.map((check, index) => (
            <Card
              key={index}
              className="h-full transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-green-600 text-secondary flex h-5 w-5 items-center justify-center rounded-full shrink-0">
                  <Check size={14} />
                </div>

                <CardTitle>{check.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col">
                <p className="whitespace-pre-line text-justify text-base">
                  {check.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
