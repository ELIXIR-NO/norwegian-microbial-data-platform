const serves = [
  'Research institutions and universities',
  'Diagnostic and public health laboratories',
  'Hospitals and biobanks',
  'Environmental and food safety agencies',
  'Industry and innovation partners',
]

export default function Who() {
  return (
    <>
      <h4 className="max-w-6xl text-justify leading-relaxed lg:mx-auto lg:py-4 text-xl">
        NMDP serves a broad community of users working with microbial and
        pathogen data:
      </h4>
      <ul className="max-w-6xl text-justify leading-relaxed lg:mx-auto lg:py-4 text-xl list-disc pl-6">
        {serves.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  )
}
