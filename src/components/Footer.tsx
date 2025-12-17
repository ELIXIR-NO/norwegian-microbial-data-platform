import { Link } from '@tanstack/react-router'

const Footer = () => {
  return (
    <footer
      className="bg-slate-50 py-12 px-4 md:px-12 dark:bg-dark-surface mt-24"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-full flex flex-col-reverse gap-y-6">
        <div className="grid grid-cols-2 grid-flow-col auto-cols-min gap-y-12">
          <ElixirOrgs />
          <Links />
        </div>
      </div>
    </footer>
  )
}

const ElixirOrgs = () => {
  const orgs = [
    ['https://uib.no/', '/logos/orgs/uib.svg', 'UiB logo'],
    ['https://uio.no/', '/logos/orgs/uio.svg', 'UiO logo'],
    ['https://uit.no/', '/logos/orgs/uit.svg', 'UiT logo'],
    ['https://ntnu.no/', '/logos/orgs/ntnu.svg', 'NTNU logo'],
    ['https://nmbu.no/', '/logos/orgs/nmbu.svg', 'NMBU logo'],
  ]

  const funders = [
    [
      'https://forskningsradet.no/',
      '/logos/orgs/nfr.svg',
      'Research Council of Norway logo',
    ],
    [
      'https://www.vetinst.no/',
      '/logos/partners/vetinst-logo-black.svg',
      'Vetinst logo',
    ],
    [
      'https://www.fhi.no/',
      '/logos/partners/logo-fhi-black_new.svg',
      'FHI logo',
    ],
  ]

  return (
    <div className="col-span-full lg:col-span-2 flex flex-col gap-y-10">
      {/* ORGS */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 lg:gap-x-4 mx-auto">
        {orgs.map(([href, imageUrl, alt]) => (
          <a href={href} target="_blank">
            <img
              src={imageUrl}
              alt={alt}
              className="invert-25 dark:invert-85 w-auto h-28 scale-75 lg:scale-100"
            />
          </a>
        ))}
      </div>
      {/* FUNDERS */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 lg:gap-x-16 mx-auto">
        {funders.map(([href, imageUrl, alt]) => (
          <a href={href} target="_blank">
            <img
              src={imageUrl}
              alt={alt}
              className="dark:invert-85 w-44 h-auto scale-75 lg:scale-120"
            />
          </a>
        ))}
      </div>
    </div>
  )
}

const Links = () => {
  return (
    <div className="col-span-full lg:col-span-1 text-right place-content-end place-items-end place-self-center lg:place-self-end">
      <div
        role="list"
        className="flex sm:flex-row lg:flex-col gap-y-2 gap-x-2 [&_*]:text-gray-800"
      >
        <Link to="/about" className="text-sm leading-6">
          About{' '}
        </Link>
        <Link to="/" className="text-sm leading-6">
          Login/Register
        </Link>
        <Link to="/public-data" className="text-sm leading-6">
          Public Data
        </Link>
        <Link to="/get-started" className="text-sm leading-6">
          Get Started
        </Link>
        <Link to="/contact-us" className="text-sm leading-6">
          Contact Us
        </Link>
      </div>
    </div>
  )
}

export default Footer
