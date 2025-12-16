const partners = [
  { name: 'The Arctic University of Norway (UiT)', url: 'https://uit.no' },
  { name: 'University of Bergen (UiB)', url: 'https://uib.no' },
  {
    name: 'Norwegian University of Science and Technology (NTNU)',
    url: 'https://ntnu.no',
  },
  { name: 'University of Oslo (UiO)', url: 'https://uio.no' },
  {
    name: 'Norwegian University of Life Sciences (NMBU)',
    url: 'https://nmbu.no',
  },
  { name: 'Norwegian Institute of Public Health (FHI)', url: 'https://fhi.no' },
  { name: 'Norwegian Veterinary Institute', url: 'https://vetinst.no' },
]

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      className="text-blue-600 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

function PartnerList() {
  return (
    <ul className="max-w-6xl text-justify leading-relaxed lg:mx-auto lg:py-4 text-xl list-disc pl-6">
      {partners.map((p) => (
        <li key={p.name}>
          <ExternalLink href={p.url}>{p.name}</ExternalLink>
        </li>
      ))}
    </ul>
  )
}

export default function Behind() {
  return (
    <>
      <h4 className="max-w-6xl text-justify leading-relaxed lg:mx-auto lg:py-4 text-xl">
        The <strong>NMDP</strong> is developed and operated by{' '}
        <ExternalLink href="https://elixir.no">ELIXIR Norway</ExternalLink>, the
        national node of the European ELIXIR infrastructure for life science
        data.
        <br />
        <br />
        ELIXIR Norway brings together national expertise in{' '}
        <strong>
          data management, bioinformatics, and e-infrastructure
        </strong>{' '}
        through its partners at:
      </h4>

      <PartnerList />
    </>
  )
}
